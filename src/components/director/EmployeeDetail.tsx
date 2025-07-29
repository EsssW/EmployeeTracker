import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockEmployees } from '../../data/mockData';
import { ArrowLeft, Calendar, User, Phone, MapPin, X } from 'lucide-react';

interface EmployeeDetailProps {
  employeeId: number;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employeeId }) => {
  const { state, dispatch } = useApp();
  const { offices, officePlans } = state;
  const [currentDate, setCurrentDate] = useState(new Date());

  const employee = mockEmployees.find(emp => emp.id === employeeId);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  while (current <= lastDay || current.getDay() !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getPlanForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return officePlans.find(plan => plan.date === dateStr && plan.user_id === employeeId);
  };

  const getOfficeForPlan = (plan: any) => {
    if (!plan?.office_id) return null;
    return offices.find(office => office.id === plan.office_id);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 'employees' });
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  if (!employee) {
    return (
      <div className="p-4">
        <div className="text-center">
          <p className="text-gray-500">Сотрудник не найден</p>
          <button onClick={handleBack} className="mt-4 text-blue-600 hover:text-blue-800">
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {employee.first_name} {employee.last_name}
        </h1>
      </div>

      {/* Employee Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-start space-x-4">
          {employee.photo_url ? (
            <img
              src={employee.photo_url}
              alt={`${employee.first_name} ${employee.last_name}`}
              className="w-20 h-20 rounded-xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {employee.first_name} {employee.last_name}
            </h2>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{employee.phone}</span>
              </div>
              {employee.username && (
                <div className="flex items-center space-x-2">
                  <span>@{employee.username}</span>
                </div>
              )}
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                {employee.role === 'director' ? 'Директор' : 'Сотрудник'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const plan = getPlanForDate(day);
            const office = getOfficeForPlan(plan);
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`
                  aspect-square p-2 rounded-xl text-sm font-medium transition-all duration-200 relative
                  ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                  ${plan?.office_id === null ? 'bg-red-50 text-red-600' : ''}
                `}
                style={{
                  backgroundColor: office ? `${office.color}20` : undefined,
                  color: office ? office.color : undefined,
                }}
              >
                <span className="relative z-10">{day.getDate()}</span>
                
                {plan?.office_id === null && (
                  <X className="absolute inset-0 w-4 h-4 m-auto text-red-500" />
                )}
                
                {office && (
                  <div 
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: office.color }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Office Legend */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Легенда</h3>
        <div className="grid grid-cols-2 gap-3">
          {offices.map(office => (
            <div key={office.id} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: office.color }}
              />
              <div>
                <p className="font-medium text-gray-900">{office.name}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {office.address}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center space-x-3">
            <X className="w-4 h-4 text-red-500" />
            <div>
              <p className="font-medium text-gray-900">Отсутствие</p>
              <p className="text-sm text-gray-500">Выходной/отпуск</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};