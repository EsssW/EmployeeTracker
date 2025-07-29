import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockEmployees } from '../../data/mockData';
import { BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  const { state } = useApp();
  const { offices, officePlans } = state;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getOfficeStatsForDate = (date: string) => {
    const plansForDate = officePlans.filter(plan => plan.date === date);
    const stats = offices.map(office => {
      const count = plansForDate.filter(plan => plan.office_id === office.id).length;
      return { office, count };
    });
    
    const absences = plansForDate.filter(plan => plan.office_id === null).length;
    const remote = plansForDate.filter(plan => plan.office_id === 'remote').length;
    
    return { stats, absences, remote, total: mockEmployees.length };
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const weekStats = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayStats = getOfficeStatsForDate(dateStr);
      
      weekStats.push({
        date: dateStr,
        dayName: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        ...dayStats
      });
    }
    
    return weekStats;
  };

  const selectedDateStats = getOfficeStatsForDate(selectedDate);
  const weeklyStats = getWeeklyStats();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Отчёты</h1>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <label htmlFor="report-date" className="text-sm font-medium text-gray-700">
            Выберите дату для детального отчёта:
          </label>
          <input
            type="date"
            id="report-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Selected Date Stats */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Отчёт на {new Date(selectedDate).toLocaleDateString('ru-RU')}
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedDateStats.stats.reduce((sum, stat) => sum + stat.count, 0) + selectedDateStats.remote}
                </p>
                <p className="text-sm text-blue-600">В офисах/удалённо</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{selectedDateStats.absences}</p>
                <p className="text-sm text-red-600">Отсутствуют</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((selectedDateStats.stats.reduce((sum, stat) => sum + stat.count, 0) + selectedDateStats.remote) / selectedDateStats.total * 100)}%
                </p>
                <p className="text-sm text-green-600">Присутствие</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold text-gray-600">{selectedDateStats.total}</p>
                <p className="text-sm text-gray-600">Всего сотрудников</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Распределение по офисам:</h3>
          {selectedDateStats.stats.map(({ office, count }) => (
            <div key={office.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
              <span className="text-lg font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Недельная динамика</h2>
        
        <div className="space-y-4">
          {weeklyStats.map(({ date, dayName, stats, absences, remote, total }) => {
            const present = stats.reduce((sum, stat) => sum + stat.count, 0) + remote;
            const percentage = Math.round(present / total * 100);
            
            return (
              <div key={date} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {dayName}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">
                      {new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {present}/{total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};