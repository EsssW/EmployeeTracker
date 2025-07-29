import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Office, OfficePlan, Project, Meeting } from '../types';
import { mockUser, mockOffices, mockOfficePlans, mockProjects, mockMeetings } from '../data/mockData';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentPage: string;
  offices: Office[];
  officePlans: OfficePlan[];
  projects: Project[];
  meetings: Meeting[];
  loading: boolean;
  isTelegramApp: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TELEGRAM_APP'; payload: boolean }
  | { type: 'UPDATE_OFFICE_PLAN'; payload: OfficePlan }
  | { type: 'ADD_MEETING'; payload: Meeting };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentPage: 'auth',
  offices: mockOffices,
  officePlans: mockOfficePlans,
  projects: mockProjects,
  meetings: mockMeetings,
  loading: false,
  isTelegramApp: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TELEGRAM_APP':
      return { ...state, isTelegramApp: action.payload };
    case 'UPDATE_OFFICE_PLAN':
      return {
        ...state,
        officePlans: state.officePlans.filter(p => !(p.date === action.payload.date && p.user_id === action.payload.user_id)).concat(action.payload)
      };
    case 'ADD_MEETING':
      return {
        ...state,
        meetings: [...state.meetings, action.payload]
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check if running in Telegram Mini App
    const isTelegram = window.Telegram?.WebApp !== undefined;
    dispatch({ type: 'SET_TELEGRAM_APP', payload: isTelegram });

    if (isTelegram) {
      window.Telegram!.WebApp.ready();
      window.Telegram!.WebApp.expand();

      // Check if user is authenticated via Telegram
      const telegramUser = window.Telegram!.WebApp.initDataUnsafe.user;
      if (telegramUser) {
        // In real app, check if user is registered in backend
        const isRegistered = mockUser.id === telegramUser.id;
        
        if (isRegistered) {
          dispatch({ type: 'SET_USER', payload: mockUser });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          dispatch({ type: 'SET_CURRENT_PAGE', payload: 'dashboard' });
        } else {
          dispatch({ type: 'SET_CURRENT_PAGE', payload: 'registration' });
        }
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};