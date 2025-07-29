import React from 'react';
import { useApp } from '../context/AppContext';
import { X, User } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { state } = useApp();
  const { user, isTelegramApp } = state;

  const handleClose = () => {
    if (isTelegramApp && window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt={`${user.first_name} ${user.last_name}`}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center ${user.photo_url ? 'hidden' : ''}`}>
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-sm text-gray-500 capitalize">{user.role === 'director' ? 'Директор' : 'Сотрудник'}</p>
        </div>
      </div>

      {isTelegramApp && (
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};