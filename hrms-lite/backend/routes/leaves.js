const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// Validation middleware
const validateLeave = [
  body('employeeId').notEmpty().trim().withMessage('Employee ID is required'),
  body('leaveType').notEmpty().withMessage('Leave type is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').notEmpty().trim().withMessage('Reason is required')
];

// Get all leave requests
router.get('/', async (req, res) => {
  try {
    const { status, employeeId, startDate, endDate } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const leaves = await Leave.find(query).sort({ appliedDate: -1 });

    res.json({
      success: true,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave requests',
      error: error.message
    });
  }
});

// Get leave requests for specific employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const leaves = await Leave.find({ employeeId }).sort({ appliedDate: -1 });
    
    const summary = {
      total: leaves.length,
      pending: leaves.filter(l => l.status === 'Pending').length,
      approved: leaves.filter(l => l.status === 'Approved').length,
      rejected: leaves.filter(l => l.status === 'Rejected').length,
      totalDaysApproved: leaves
        .filter(l => l.status === 'Approved')
        .reduce((sum, l) => sum + l.totalDays, 0)
    };

    res.json({
      success: true,
      data: {
        employee: {
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          department: employee.department
        },
        summary,
        leaves
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee leaves',
      error: error.message
    });
  }
});

// Get single leave request
router.get('/:id', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    res.json({
      success: true,
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave request',
      error: error.message
    });
  }
});

// Apply for leave
router.post('/', validateLeave, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be before start date'
      });
    }

    // Check for overlapping leaves
    const overlappingLeave = await Leave.findOne({
      employeeId,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlappingLeave) {
      return res.status(409).json({
        success: false,
        message: 'You already have a leave request for this period'
      });
    }

    const leave = new Leave({
      employeeId,
      employeeName: employee.fullName,
      department: employee.department,
      leaveType,
      startDate: start,
      endDate: end,
      reason
    });

    await leave.save();

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error applying for leave',
      error: error.message
    });
  }
});

// Update leave status (Approve/Reject) - Admin only
router.put('/:id/status', async (req, res) => {
  try {
    const { status, adminComments, reviewedBy } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (Approved/Rejected) is required'
      });
    }

    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Leave request is already ${leave.status}`
      });
    }

    leave.status = status;
    leave.reviewedBy = reviewedBy || 'Admin';
    leave.reviewedDate = new Date();
    leave.adminComments = adminComments || null;

    await leave.save();

    res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating leave status',
      error: error.message
    });
  }
});

// Cancel leave request (only if pending)
router.delete('/:id', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${leave.status.toLowerCase()} leave request`
      });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Leave request cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling leave request',
      error: error.message
    });
  }
});

// Get leave statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalLeaves = await Leave.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    const approvedLeaves = await Leave.countDocuments({ status: 'Approved' });
    const rejectedLeaves = await Leave.countDocuments({ status: 'Rejected' });

    // Get current month statistics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyLeaves = await Leave.find({
      appliedDate: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Leave type breakdown
    const leaveTypeStats = await Leave.aggregate([
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overall: {
          total: totalLeaves,
          pending: pendingLeaves,
          approved: approvedLeaves,
          rejected: rejectedLeaves
        },
        thisMonth: {
          total: monthlyLeaves.length,
          pending: monthlyLeaves.filter(l => l.status === 'Pending').length,
          approved: monthlyLeaves.filter(l => l.status === 'Approved').length,
          rejected: monthlyLeaves.filter(l => l.status === 'Rejected').length
        },
        byType: leaveTypeStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave statistics',
      error: error.message
    });
  }
});

module.exports = router;
