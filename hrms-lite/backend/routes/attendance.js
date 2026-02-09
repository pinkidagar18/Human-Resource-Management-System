const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Validation middleware
const validateAttendance = [
  body('employeeId').notEmpty().trim().withMessage('Employee ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['Present', 'Absent']).withMessage('Status must be Present or Absent')
];

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    let query = {};

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await Attendance.find(query).sort({ date: -1 });
    
    // Populate employee details
    const enrichedRecords = await Promise.all(
      attendanceRecords.map(async (record) => {
        const employee = await Employee.findOne({ employeeId: record.employeeId });
        return {
          _id: record._id,
          employeeId: record.employeeId,
          employeeName: employee ? employee.fullName : 'Unknown',
          department: employee ? employee.department : 'Unknown',
          date: record.date,
          status: record.status,
          createdAt: record.createdAt
        };
      })
    );

    res.json({
      success: true,
      data: enrichedRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
});

// Get attendance for specific employee
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

    const attendanceRecords = await Attendance.find({ employeeId }).sort({ date: -1 });
    
    const presentDays = attendanceRecords.filter(r => r.status === 'Present').length;
    const absentDays = attendanceRecords.filter(r => r.status === 'Absent').length;

    res.json({
      success: true,
      data: {
        employee: {
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          department: employee.department
        },
        summary: {
          totalDays: attendanceRecords.length,
          presentDays,
          absentDays
        },
        records: attendanceRecords
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee attendance',
      error: error.message
    });
  }
});

// Mark attendance
router.post('/', validateAttendance, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { employeeId, date, status } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Normalize date to remove time component
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      await existingAttendance.save();
      
      return res.json({
        success: true,
        message: 'Attendance updated successfully',
        data: existingAttendance
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      employeeId,
      date: attendanceDate,
      status
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance record',
      error: error.message
    });
  }
});

module.exports = router;
