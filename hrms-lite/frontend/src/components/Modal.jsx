import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 transition-opacity" 
          onClick={onClose}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          }}
        ></div>
        
        <div 
          className="relative glass-card max-w-md w-full z-10"
          style={{
            animation: 'scaleIn 0.3s ease-out',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            {children}
          </div>
          
          {footer && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
