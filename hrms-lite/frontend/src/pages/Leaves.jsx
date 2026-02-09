import { useState, useEffect } from 'react';
import { Plus, Plane, Check, X, Clock, Calendar as CalendarIcon, FileText, User, Filter, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { leaveAPI, employeeAPI } from '../api/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [approvalData, setApprovalData] = useState({
    status: '',
    adminComments: '',
    reviewedBy: 'Admin',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
    fetchStats();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await leaveAPI.getAll();
      setLeaves(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await leaveAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.startDate || !formData.endDate || !formData.reason) {
      setFormError('All fields are required');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end < start) {
      setFormError('End date cannot be before start date');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      await leaveAPI.apply(formData);
      await fetchLeaves();
      await fetchStats();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproval = async (status) => {
    try {
      setSubmitting(true);
      await leaveAPI.updateStatus(selectedLeave._id, {
        status,
        adminComments: approvalData.adminComments,
        reviewedBy: approvalData.reviewedBy,
      });
      await fetchLeaves();
      await fetchStats();
      setIsApprovalModalOpen(false);
      setSelectedLeave(null);
      setApprovalData({ status: '', adminComments: '', reviewedBy: 'Admin' });
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${status.toLowerCase()} leave`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) return;

    try {
      await leaveAPI.cancel(id);
      await fetchLeaves();
      await fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel leave request');
    }
  };

  const openApprovalModal = (leave) => {
    setSelectedLeave(leave);
    setIsApprovalModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      employeeId: '',
      leaveType: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    });
    setFormError('');
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filterStatus === 'All') return true;
    return leave.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'from-green-500 to-emerald-600';
      case 'Rejected':
        return 'from-red-500 to-pink-600';
      case 'Pending':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return CheckCircle2;
      case 'Rejected':
        return XCircle;
      case 'Pending':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading) return <Loading message="Loading leave requests..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Plane className="text-purple-600" size={32} />
              <h2 className="page-title">Leave Management</h2>
            </div>
            <p className="section-subtitle">Apply for leaves and manage approval requests</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <div className="flex items-center gap-2">
              <Plus size={20} />
              <span>Apply Leave</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Total Leaves</p>
                <p className="text-4xl font-bold text-gray-900">{stats.overall.total}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                <Plane className="text-purple-600" size={28} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Pending</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{stats.overall.pending}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100">
                <Clock className="text-yellow-600" size={28} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Approved</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.overall.approved}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
                <CheckCircle2 className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Rejected</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{stats.overall.rejected}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100">
                <XCircle className="text-red-600" size={28} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <Filter className="text-gray-600" size={20} />
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Leave Requests List */}
      {filteredLeaves.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            icon={Plane}
            title="No leave requests found"
            description={filterStatus === 'All' ? 'Start by applying for your first leave' : `No ${filterStatus.toLowerCase()} leave requests`}
            action={
              filterStatus === 'All' ? (
                <Button onClick={() => setIsModalOpen(true)}>
                  <div className="flex items-center gap-2">
                    <Plus size={20} />
                    <span>Apply Leave</span>
                  </div>
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLeaves.map((leave, index) => {
            const StatusIcon = getStatusIcon(leave.status);
            return (
              <div
                key={leave._id}
                className="gradient-card p-6"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatusColor(leave.status)} flex items-center justify-center shadow-lg`}>
                      <StatusIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{leave.employeeName}</h3>
                      <p className="text-sm text-gray-600">{leave.department}</p>
                    </div>
                  </div>
                  <span className={`badge bg-gradient-to-r ${getStatusColor(leave.status)} text-white px-4 py-2`}>
                    {leave.status}
                  </span>
                </div>

                {/* Leave Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <CalendarIcon size={16} className="text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <FileText size={16} className="text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Leave Type</p>
                      <p className="text-sm font-semibold text-gray-900">{leave.leaveType}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 font-medium mb-1">Reason</p>
                    <p className="text-sm text-gray-900">{leave.reason}</p>
                  </div>

                  {leave.adminComments && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-xs text-blue-600 font-medium mb-1">Admin Comments</p>
                      <p className="text-sm text-blue-900">{leave.adminComments}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Applied on {formatDate(leave.appliedDate)}
                    {leave.reviewedDate && (
                      <span> • Reviewed on {formatDate(leave.reviewedDate)}</span>
                    )}
                  </div>
                  {leave.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => openApprovalModal(leave)}>
                        <Check size={16} />
                      </Button>
                      <Button variant="danger" onClick={() => handleCancel(leave._id)}>
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Apply for Leave"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Apply Leave'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && <ErrorMessage message={formError} />}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Employee *
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.fullName} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Leave Type *
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
          </div>

          {formData.startDate && formData.endDate && (
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-sm text-purple-900 font-semibold">
                Total Days: {calculateDays(formData.startDate, formData.endDate)}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="input-field"
              rows="4"
              placeholder="Enter reason for leave..."
              required
            />
          </div>
        </form>
      </Modal>

      {/* Approval Modal */}
      {selectedLeave && (
        <Modal
          isOpen={isApprovalModalOpen}
          onClose={() => {
            setIsApprovalModalOpen(false);
            setSelectedLeave(null);
            setApprovalData({ status: '', adminComments: '', reviewedBy: 'Admin' });
          }}
          title="Review Leave Request"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsApprovalModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleApproval('Rejected')} disabled={submitting}>
                {submitting ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button onClick={() => handleApproval('Approved')} disabled={submitting}>
                {submitting ? 'Approving...' : 'Approve'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3">Leave Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Employee:</span> {selectedLeave.employeeName}</p>
                <p><span className="font-medium">Department:</span> {selectedLeave.department}</p>
                <p><span className="font-medium">Type:</span> {selectedLeave.leaveType}</p>
                <p><span className="font-medium">Duration:</span> {formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)} ({selectedLeave.totalDays} days)</p>
                <p><span className="font-medium">Reason:</span> {selectedLeave.reason}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Comments (Optional)
              </label>
              <textarea
                value={approvalData.adminComments}
                onChange={(e) => setApprovalData({ ...approvalData, adminComments: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Add comments..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reviewed By
              </label>
              <input
                type="text"
                value={approvalData.reviewedBy}
                onChange={(e) => setApprovalData({ ...approvalData, reviewedBy: e.target.value })}
                className="input-field"
                placeholder="Admin name"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
