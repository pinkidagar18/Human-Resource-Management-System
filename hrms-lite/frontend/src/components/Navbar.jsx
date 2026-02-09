import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, LayoutDashboard, Plane } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/attendance', label: 'Attendance', icon: Calendar },
    { path: '/leaves', label: 'Leaves', icon: Plane },
  ];

  return (
    <nav className="glass-card sticky top-4 mx-4 z-50 mb-6" style={{ marginTop: '1.5rem' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden border border-gray-100">
              <img src={logo} alt="HRMS Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Outfit, sans-serif' }}>
                HRMS Lite
              </h1>
              <p className="text-xs text-gray-500 font-medium">Human Resource Management</p>
            </div>
          </div>

          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:text-purple-600'
                    }`}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    boxShadow: isActive
                      ? '0 4px 16px rgba(102, 126, 234, 0.4)'
                      : 'none'
                  }}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <Icon size={20} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full opacity-50" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
