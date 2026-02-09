import { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, XCircle, Clock, TrendingUp, Briefcase, Plane, Activity, Award, BarChart3, PieChart } from 'lucide-react';
import { dashboardAPI, leaveAPI } from '../api/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [leaveStats, setLeaveStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchLeaveStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveStats = async () => {
    try {
      const response = await leaveAPI.getStats();
      setLeaveStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch leave stats:', err);
    }
  };

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  const attendancePercentage = stats.totalEmployees > 0 
    ? ((stats.todayAttendance.present / stats.totalEmployees) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Welcome Back! 
              </h1>
              <p className="text-gray-600 text-lg">Here's what's happening in your organization today</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Today's Date</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="stat-card bg-gradient-to-br from-blue-500 to-cyan-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Users size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <TrendingUp size={20} className="text-white opacity-70" />
            </div>
            <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wider mb-1">Total Employees</p>
            <p className="text-5xl font-bold mb-2">{stats.totalEmployees}</p>
            <p className="text-white text-opacity-80 text-sm">Active workforce</p>
          </div>
        </div>

        {/* Present Today */}
        <div className="stat-card bg-gradient-to-br from-emerald-500 to-teal-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <CheckCircle size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{attendancePercentage}%</p>
              </div>
            </div>
            <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wider mb-1">Present Today</p>
            <p className="text-5xl font-bold mb-2">{stats.todayAttendance.present}</p>
            <p className="text-white text-opacity-80 text-sm">Attendance rate</p>
          </div>
        </div>

        {/* Absent Today */}
        <div className="stat-card bg-gradient-to-br from-rose-500 to-pink-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <XCircle size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <Activity size={20} className="text-white opacity-70" />
            </div>
            <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wider mb-1">Absent Today</p>
            <p className="text-5xl font-bold mb-2">{stats.todayAttendance.absent}</p>
            <p className="text-white text-opacity-80 text-sm">Need attention</p>
          </div>
        </div>

        {/* Not Marked */}
        <div className="stat-card bg-gradient-to-br from-amber-500 to-orange-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Clock size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <Award size={20} className="text-white opacity-70" />
            </div>
            <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wider mb-1">Not Marked</p>
            <p className="text-5xl font-bold mb-2">{stats.todayAttendance.notMarked}</p>
            <p className="text-white text-opacity-80 text-sm">Pending action</p>
          </div>
        </div>
      </div>

      {/* Leave Management Summary */}
      {leaveStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
                <Plane className="text-yellow-600" size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Pending Leaves</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{leaveStats.overall.pending}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Requires approval</p>
            </div>
          </div>

          <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                <CheckCircle size={32} className="text-green-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Approved Leaves</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{leaveStats.overall.approved}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">This month: {leaveStats.thisMonth.approved}</p>
            </div>
          </div>

          <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                <Calendar size={32} className="text-purple-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Total Leaves</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{leaveStats.overall.total}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">All time requests</p>
            </div>
          </div>
        </div>
      )}

      {/* Department Overview & Attendance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        {stats.departments.length > 0 && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Briefcase className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Department Distribution</h3>
                <p className="text-sm text-gray-600">Employee count by department</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {stats.departments.map((dept, index) => {
                const percentage = ((dept.count / stats.totalEmployees) * 100).toFixed(1);
                const colors = [
                  'from-purple-500 to-pink-500',
                  'from-blue-500 to-cyan-500',
                  'from-emerald-500 to-teal-500',
                  'from-orange-500 to-red-500',
                  'from-indigo-500 to-purple-500'
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`}></div>
                        <span className="font-semibold text-gray-900">{dept.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{percentage}%</span>
                        <span className="font-bold text-gray-900">{dept.count}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`}
                        style={{ 
                          width: `${percentage}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Today's Attendance Breakdown */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Today's Attendance</h3>
              <p className="text-sm text-gray-600">Real-time attendance status</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Present */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Present</p>
                  <p className="text-xs text-gray-600">{attendancePercentage}% attendance</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.todayAttendance.present}</p>
            </div>

            {/* Absent */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <XCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Absent</p>
                  <p className="text-xs text-gray-600">Need follow-up</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.todayAttendance.absent}</p>
            </div>

            {/* Not Marked */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Clock className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Not Marked</p>
                  <p className="text-xs text-gray-600">Pending action</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.todayAttendance.notMarked}</p>
            </div>
          </div>

          {/* Attendance Progress Bar */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Attendance</span>
              <span className="text-sm font-bold text-gray-900">{attendancePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                style={{ width: `${attendancePercentage}%` }}
              >
                <span className="text-xs font-bold text-white">{attendancePercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Frequently used features</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a href="/employees" className="group p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-transparent hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <Users className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-bold text-gray-900 mb-1">Add Employee</h4>
            <p className="text-xs text-gray-600">Create new employee record</p>
          </a>

          <a href="/attendance" className="group p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-transparent hover:border-green-300 hover:shadow-lg transition-all duration-300">
            <Calendar className="text-green-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-bold text-gray-900 mb-1">Mark Attendance</h4>
            <p className="text-xs text-gray-600">Record daily attendance</p>
          </a>

          <a href="/leaves" className="group p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-transparent hover:border-purple-300 hover:shadow-lg transition-all duration-300">
            <Plane className="text-purple-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-bold text-gray-900 mb-1">Apply Leave</h4>
            <p className="text-xs text-gray-600">Submit leave request</p>
          </a>

          <a href="/leaves" className="group p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-transparent hover:border-orange-300 hover:shadow-lg transition-all duration-300">
            <PieChart className="text-orange-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-bold text-gray-900 mb-1">View Reports</h4>
            <p className="text-xs text-gray-600">Analytics & insights</p>
          </a>
        </div>
      </div>
    </div>
  );
}
