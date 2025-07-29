import React from 'react';
import { useApp } from '../context/AppContext';
import { TopBar } from './TopBar';
import { BottomNavigation } from './BottomNavigation';
import { OfficePlanning } from './OfficePlanning';
import { Projects } from './Projects';
import { Meetings } from './Meetings';
import { Employees } from './director/Employees';
import { EmployeeDetail } from './director/EmployeeDetail';
import { Reports } from './director/Reports';
import { CreateMeeting } from './director/CreateMeeting';

export const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { currentPage } = state;

  const renderCurrentPage = () => {
    if (currentPage.startsWith('employee-detail-')) {
      const employeeId = parseInt(currentPage.split('-')[2]);
      return <EmployeeDetail employeeId={employeeId} />;
    }

    switch (currentPage) {
      case 'office-planning':
        return <OfficePlanning />;
      case 'projects':
        return <Projects />;
      case 'meetings':
        return <Meetings />;
      case 'employees':
        return <Employees />;
      case 'reports':
        return <Reports />;
      case 'create-meeting':
        return <CreateMeeting />;
      default:
        return <OfficePlanning />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <div className="flex-1 overflow-auto pb-20">
        {renderCurrentPage()}
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNavigation />
      </div>
    </div>
  );
};