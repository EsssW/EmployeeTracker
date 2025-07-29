export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  phone?: string;
  role: 'employee' | 'director';
  is_registered: boolean;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  allows_write_to_pm?: boolean;
}

export interface WebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
}

export interface Office {
  id: string;
  name: string;
  color: string;
  address: string;
}

export interface OfficePlan {
  date: string;
  office_id: string | null; // null means absence
  user_id: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  deadline: string;
  participants: User[];
  progress: number;
  status: 'active' | 'completed' | 'on_hold';
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number; // in minutes
  participants: User[];
  project_id?: string;
  created_by: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}