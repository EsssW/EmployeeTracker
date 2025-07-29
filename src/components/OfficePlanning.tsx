import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, X, MapPin } from 'lucide-react';

export const OfficePlanning: React.FC = () => {
  const { state, dispatch } = useApp();
  const { offices, officePlans, user } = state;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
    return officePlans.find(plan => plan.date === dateStr && plan.user_id === user?.id);
  };

  const getOfficeForPlan = (plan: any) => {
    if (!plan?.office_id) return null;
    return offices.find(office => office.id === plan.office_id);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate >= today;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    if (isFutureDate(date)) {
      setSelectedDate(formatDate(date));
    }
  };

  const handlePlanUpdate = (officeId: string | null) => {
    if (!selectedDate || !user) return;

    dispatch({
      type: 'UPDATE_OFFICE_PLAN',
      payload: {
        date: selectedDate,
        office_id: officeId,
        user_id: user.id,
      }
    });
    setSelectedDate(null);
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Планирование офисов</h1>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
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
            const isTodayDate = isToday(day);
            const canEdit = isFutureDate(day);
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={!canEdit}
                className={`
                  aspect-square p-2 rounded-xl text-sm font-medium transition-all duration-200 relative
                  ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                  ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
                  ${canEdit ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'}
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Office Legend */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Офисы</h3>
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

      {/* Plan Selection Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                План на {new Date(selectedDate).toLocaleDateString('ru-RU')}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-3">
              {offices.map(office => (
                <button
                  key={office.id}
                  onClick={() => handlePlanUpdate(office.id)}
                  className="w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: office.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{office.name}</p>
                      <p className="text-sm text-gray-500">{office.address}</p>
                    </div>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => handlePlanUpdate(null)}
                className="w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <X className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">Отсутствие</p>
                    <p className="text-sm text-gray-500">Выходной/отпуск</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};