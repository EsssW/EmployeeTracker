import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';

export const Projects: React.FC = () => {
  const { state } = useApp();
  const { projects } = state;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активный';
      case 'completed': return 'Завершен';
      case 'on_hold': return 'Приостановлен';
      default: return 'Неизвестно';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Проекты</h1>
      </div>

      <div className="space-y-4">
        {projects.map(project => {
          const daysLeft = getDaysUntilDeadline(project.deadline);
          
          return (
            <div key={project.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.deadline).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className={daysLeft < 7 ? 'text-red-600 font-medium' : daysLeft < 30 ? 'text-yellow-600' : ''}>
                        {daysLeft > 0 ? `${daysLeft} дн.` : daysLeft === 0 ? 'Сегодня' : 'Просрочен'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Прогресс</span>
                  <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {project.participants.length} участник{project.participants.length > 1 ? 'ов' : ''}
                  </span>
                </div>
                
                <div className="flex -space-x-2">
                  {project.participants.slice(0, 3).map((participant, index) => (
                    <div key={participant.id} className="relative">
                      {participant.photo_url ? (
                        <img
                          src={participant.photo_url}
                          alt={`${participant.first_name} ${participant.last_name}`}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {participant.first_name[0]}{participant.last_name?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {project.participants.length > 3 && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600 font-medium">
                        +{project.participants.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};