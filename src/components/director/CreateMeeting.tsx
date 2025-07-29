import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockEmployees } from '../../data/mockData';
import { Users, Calendar, Clock, FileText, Briefcase, Plus } from 'lucide-react';

export const CreateMeeting: React.FC = () => {
  const { state, dispatch } = useApp();
  const { projects } = state;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    project_id: '',
    participant_ids: [] as number[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time || formData.participant_ids.length === 0) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const selectedParticipants = mockEmployees.filter(emp => 
      formData.participant_ids.includes(emp.id)
    );

    const newMeeting = {
      id: `meeting-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      participants: [state.user!, ...selectedParticipants],
      project_id: formData.project_id || undefined,
      created_by: state.user!.id,
      status: 'scheduled' as const,
    };

    dispatch({ type: 'ADD_MEETING', payload: newMeeting });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      project_id: '',
      participant_ids: [],
    });

    alert('Встреча успешно создана!');
  };

  const handleParticipantToggle = (employeeId: number) => {
    setFormData(prev => ({
      ...prev,
      participant_ids: prev.participant_ids.includes(employeeId)
        ? prev.participant_ids.filter(id => id !== employeeId)
        : [...prev.participant_ids, employeeId]
    }));
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Создать встречу</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Основная информация</span>
          </h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Название встречи *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Введите название встречи"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Дополнительная информация о встрече"
            />
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
              Проект
            </label>
            <select
              id="project"
              value={formData.project_id}
              onChange={(e) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Выберите проект (опционально)</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Дата и время</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Дата *
              </label>
              <input
                type="date"
                id="date"
                required
                min={getTomorrowDate()}
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Время *
              </label>
              <input
                type="time"
                id="time"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Длительность (мин)
              </label>
              <input
                type="number"
                id="duration"
                min="15"
                max="480"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Участники *</span>
          </h2>
          
          <div className="space-y-3">
            {mockEmployees.map(employee => (
              <label
                key={employee.id}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={formData.participant_ids.includes(employee.id)}
                  onChange={() => handleParticipantToggle(employee.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                
                {employee.photo_url ? (
                  <img
                    src={employee.photo_url}
                    alt={`${employee.first_name} ${employee.last_name}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-sm text-white font-medium">
                      {employee.first_name[0]}{employee.last_name?.[0]}
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{employee.phone}</p>
                </div>
              </label>
            ))}
          </div>
          
          {formData.participant_ids.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700">
                Выбрано участников: {formData.participant_ids.length}
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Создать встречу</span>
          </button>
        </div>
      </form>
    </div>
  );
};