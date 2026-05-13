import { useEffect, useState } from 'react';

export default function ConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "External Link", 
  message = "This would take you to an external website that opens in a new tab. Do you want to continue anyway?",
  confirmText = "Continue",
  cancelText = "Cancel"
}) {
  useEffect(() => {
    // Handle ESC key to close popup
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    // Prevent body scroll when popup is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
            <svg 
              className="w-6 h-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          
          {/* Content */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {message}
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple confirmation function using browser alert
export function showConfirmationPopup(options) {
  return new Promise((resolve) => {
    const message = options.message || 'This would take you to an external website that opens in a new tab. Do you want to continue anyway?';
    const result = window.confirm(message);
    resolve(result);
  });
}
