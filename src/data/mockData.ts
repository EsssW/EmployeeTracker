import { User, Office, OfficePlan, Project, Meeting } from '../types';

export const mockUser: User = {
  id: 123456789,
  first_name: 'Иван',
  last_name: 'Петров',
  username: 'ivan_petrov',
  photo_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  phone: '+7 (999) 123-45-67',
  role: 'director',
  is_registered: true,
};

export const mockOffices: Office[] = [
  { id: 'office-1', name: 'Москва Центр', color: '#007AFF', address: 'ул. Тверская, 10' },
  { id: 'office-2', name: 'Москва Сити', color: '#34C759', address: 'Москва-Сити, башня Федерация' },
  { id: 'office-3', name: 'СПБ Офис', color: '#FF9500', address: 'Невский проспект, 25' },
  { id: 'remote', name: 'Удаленно', color: '#8E8E93', address: 'Дистанционная работа' },
];

export const mockOfficePlans: OfficePlan[] = [
  { date: '2025-01-15', office_id: 'office-1', user_id: 123456789 },
  { date: '2025-01-16', office_id: 'office-2', user_id: 123456789 },
  { date: '2025-01-17', office_id: null, user_id: 123456789 }, // absence
  { date: '2025-01-18', office_id: 'remote', user_id: 123456789 },
  { date: '2025-01-19', office_id: 'office-1', user_id: 123456789 },
];

export const mockEmployees: User[] = [
  {
    id: 987654321,
    first_name: 'Анна',
    last_name: 'Смирнова',
    username: 'anna_smirnova',
    photo_url: 'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    phone: '+7 (999) 234-56-78',
    role: 'employee',
    is_registered: true,
  },
  {
    id: 555666777,
    first_name: 'Михаил',
    last_name: 'Козлов',
    username: 'mikhail_kozlov',
    photo_url: 'https://images.pexels.com/photos/3781104/pexels-photo-3781104.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    phone: '+7 (999) 345-67-89',
    role: 'employee',
    is_registered: true,
  },
  {
    id: 111222333,
    first_name: 'Елена',
    last_name: 'Волкова',
    username: 'elena_volkova',
    photo_url: 'https://images.pexels.com/photos/4307869/pexels-photo-4307869.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    phone: '+7 (999) 456-78-90',
    role: 'employee',
    is_registered: true,
  },
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Мобильное приложение',
    description: 'Разработка корпоративного мобильного приложения для сотрудников',
    deadline: '2025-03-15',
    participants: [mockUser, ...mockEmployees.slice(0, 2)],
    progress: 65,
    status: 'active',
  },
  {
    id: 'project-2',
    name: 'Обновление сайта',
    description: 'Редизайн и техническое обновление корпоративного веб-сайта',
    deadline: '2025-02-28',
    participants: [mockUser, ...mockEmployees.slice(1, 3)],
    progress: 40,
    status: 'active',
  },
  {
    id: 'project-3',
    name: 'CRM система',
    description: 'Внедрение новой CRM системы для управления клиентами',
    deadline: '2025-04-30',
    participants: [mockUser, ...mockEmployees],
    progress: 25,
    status: 'active',
  },
];

export const mockMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    title: 'Планерка по проекту',
    description: 'Обсуждение текущего прогресса по мобильному приложению',
    date: '2025-01-20',
    time: '10:00',
    duration: 60,
    participants: [mockUser, ...mockEmployees.slice(0, 2)],
    project_id: 'project-1',
    created_by: mockUser.id,
    status: 'scheduled',
  },
  {
    id: 'meeting-2',
    title: 'Демо версии сайта',
    description: 'Показ промежуточных результатов работы над сайтом',
    date: '2025-01-18',
    time: '14:00',
    duration: 90,
    participants: [mockUser, ...mockEmployees.slice(1, 3)],
    project_id: 'project-2',
    created_by: mockUser.id,
    status: 'completed',
  },
  {
    id: 'meeting-3',
    title: 'Интервью с кандидатом',
    description: 'Собеседование с потенциальным новым сотрудником',
    date: '2025-01-22',
    time: '15:30',
    duration: 45,
    participants: [mockUser, mockEmployees[0]],
    created_by: mockUser.id,
    status: 'scheduled',
  },
];