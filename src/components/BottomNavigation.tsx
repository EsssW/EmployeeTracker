import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Briefcase, Users, UserCheck, BarChart3, UserPlus } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { state, dispatch } = useApp();
  const { currentPage, user } = state;

  const navigationItems = [
    { id: 'office-planning', label: 'Офисы', icon: Calendar },
    { id: 'projects', label: 'Проекты', icon: Briefcase },
    { id: 'meetings', label: 'Встречи', icon: Users },
  ];

  const directorItems = [
    { id: 'employees', label: 'Сотрудники', icon: UserCheck },
    { id: 'reports', label: 'Отчёты', icon: BarChart3 },
    { id: 'create-meeting', label: 'Встреча', icon: UserPlus },
  ];

  const handleNavigation = (pageId: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="grid grid-cols-3 gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {user?.role === 'director' && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2">
            {directorItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};