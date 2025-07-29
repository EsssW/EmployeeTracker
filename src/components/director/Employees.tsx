import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockEmployees } from '../../data/mockData';
import { User, Phone, Calendar, MapPin } from 'lucide-react';

export const Employees: React.FC = () => {
  const { state, dispatch } = useApp();
  const { offices, officePlans } = state;

  const handleEmployeeDetail = (employee: any) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: `employee-detail-${employee.id}` });
  };

  const getRecentPlans = (userId: number) => {
    const today = new Date();
    const recentPlans = officePlans
      .filter(plan => plan.user_id === userId)
      .filter(plan => {
        const planDate = new Date(plan.date);
        const diffTime = Math.abs(planDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    return recentPlans;
  };

  const getOfficeForPlan = (plan: any) => {
    if (!plan?.office_id) return null;
    return offices.find(office => office.id === plan.office_id);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Сотрудники</h1>
      </div>

      <div className="space-y-4">
        {mockEmployees.map(employee => {
          const recentPlans = getRecentPlans(employee.id);
          
          return (
            <div key={employee.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start space-x-4">
                {employee.photo_url ? (
                  <img
                    src={employee.photo_url}
                    alt={`${employee.first_name} ${employee.last_name}`}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{employee.phone}</span>
                    </div>
                    {employee.username && (
                      <div className="flex items-center space-x-1">
                        <span>@{employee.username}</span>
                      </div>
                    )}
                  </div>

                  {/* Recent Plans */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Ближайшие планы:</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {recentPlans.length > 0 ? (
                        recentPlans.map(plan => {
                          const office = getOfficeForPlan(plan);
                          const planDate = new Date(plan.date);
                          
                          return (
                            <div 
                              key={plan.date}
                              className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1"
                            >
                              <span className="text-xs text-gray-600">
                                {planDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                              </span>
                              {plan.office_id === null ? (
                                <span className="text-xs text-red-600 font-medium">Отсутствие</span>
                              ) : office ? (
                                <div className="flex items-center space-x-1">
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: office.color }}
                                  />
                                  <span className="text-xs text-gray-700">{office.name}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">Не указано</span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-xs text-gray-500">Планы не заданы</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEmployeeDetail(employee)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                >
                  Подробнее
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};