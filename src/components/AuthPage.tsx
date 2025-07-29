import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Users, Calendar, Building } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleTelegramLogin = () => {
    // In real app, this would redirect to Telegram bot
    window.open('https://t.me/your_bot_name', '_blank');
  };

  const handleDemoLogin = () => {
    // Demo login for development
    dispatch({ type: 'SET_USER', payload: {
      id: 123456789,
      first_name: 'Demo',
      last_name: 'User',
      role: 'director',
      is_registered: true,
    }});
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 'dashboard' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">EmployeeTracker</h1>
            <p className="text-gray-600">Система управления сотрудниками и планирования</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Планирование</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-green-500" />
                <span>Офисы</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span>Встречи</span>
              </div>
            </div>
          </div>

          {!state.isTelegramApp && (
            <div className="space-y-4">
              <button
                onClick={handleTelegramLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Войти через Telegram</span>
              </button>
              
              <button
                onClick={handleDemoLogin}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Демо-вход (для разработки)
              </button>
            </div>
          )}

          <div className="mt-8 text-xs text-gray-500">
            <p>Для полного функционала используйте Telegram Mini App</p>
          </div>
        </div>
      </div>
    </div>
  );
};