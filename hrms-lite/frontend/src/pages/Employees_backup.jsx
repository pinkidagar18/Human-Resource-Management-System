import { useState, useEffect } from 'react';
import { Plus, Trash2, Users as UsersIcon, Mail, Briefcase, User, Sparkles } from 'lucide-react';
import { employeeAPI } from '../api/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    department: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
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
    
    if (!formData.employeeId || !formData.fullName || !formData.email || !formData.department) {
      setFormError('All fields are required');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      await employeeAPI.create(formData);
      await fetchEmployees();
      setIsModalOpen(false);
      setFormData({ employeeId: '', fullName: '', email: '', department: '' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await employeeAPI.delete(id);
      await fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const getColorForEmployee = (index) => {
    const colors = [
      { bg: 'from-purple-500 to-pink-500', light: 'from-purple-50 to-pink-50', text: 'from-purple-600 to-pink-600' },
      { bg: 'from-blue-500 to-cyan-500', light: 'from-blue-50 to-cyan-50', text: 'from-blue-600 to-cyan-600' },
      { bg: 'from-emerald-500 to-teal-500', light: 'from-emerald-50 to-teal-50', text: 'from-emerald-600 to-teal-600' },
      { bg: 'from-orange-500 to-red-500', light: 'from-orange-50 to-red-50', text: 'from-orange-600 to-red-600' },
      { bg: 'from-indigo-500 to-purple-500', light: 'from-indigo-50 to-purple-50', text: 'from-indigo-600 to-purple-600' },
    ];
    return colors[index % colors.length];
  };

  if (loading) return <Loading message="Loading employees..." />;

  return (
    <div className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <User className="text-purple-600" size={32} />
              <h2 className="page-title">Employees</h2>
            </div>
            <p className="section-subtitle">Manage your employee records and team members</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <div className="flex items-center gap-2">
              <Plus size={20} />
              <span>Add Employee</span>
            </div>
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {employees.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            icon={UsersIcon}
            title="No employees found"
            description="Get started by adding your first employee to the system"
            action={
              <Button onClick={() => setIsModalOpen(true)}>
                <div className="flex items-center gap-2">
                  <Plus size={20} />
                  <span>Add Your First Employee</span>
                </div>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee, index) => {
            const colors = getColorForEmployee(index);
            return (
              <div 
                key={employee._id} 
                className="employee-card group"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <span className="text-white text-2xl font-bold">
                      {employee.fullName.charAt(0).toUpperCase()}
                    </span>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow" />
                  </div>
                  <button
                    onClick={() => handleDelete(employee._id, employee.fullName)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    title="Delete employee"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
                  {employee.fullName}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.light}`}>
                      <UsersIcon size={16} className={`bg-gradient-to-br ${colors.text} bg-clip-text text-transparent`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Employee ID</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{employee.employeeId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.light}`}>
                      <Mail size={16} className={`bg-gradient-to-br ${colors.text} bg-clip-text text-transparent`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{employee.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.light}`}>
                      <Briefcase size={16} className={`bg-gradient-to-br ${colors.text} bg-clip-text text-transparent`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Department</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{employee.department}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.bg}`} />
                      Active
                    </span>
                    <span>
                      {new Date(employee.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ employeeId: '', fullName: '', email: '', department: '' });
          setFormError('');
        }}
        title="Add New Employee"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && <ErrorMessage message={formError} />}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Employee ID *
            </label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., EMP001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., john.doe@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department *
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., Engineering"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
