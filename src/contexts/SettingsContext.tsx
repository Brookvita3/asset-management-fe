import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface SettingsContextType {
  // Display settings
  darkMode: boolean;
  sidebarVisible: boolean;
  
  // Notification settings
  emailNotifications: boolean;
  evaluationReminders: boolean;
  reminderDaysBefore: number;
  
  // Chatbot settings
  chatbotEnabled: boolean;
  autoSuggestions: boolean;
  
  // Actions
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setEmailNotifications: (enabled: boolean) => void;
  setEvaluationReminders: (enabled: boolean) => void;
  setReminderDaysBefore: (days: number) => void;
  setChatbotEnabled: (enabled: boolean) => void;
  setAutoSuggestions: (enabled: boolean) => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS = {
  darkMode: false,
  sidebarVisible: true,
  emailNotifications: true,
  evaluationReminders: true,
  reminderDaysBefore: 7,
  chatbotEnabled: true,
  autoSuggestions: true,
};

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [darkMode, setDarkMode] = useState(DEFAULT_SETTINGS.darkMode);
  const [sidebarVisible, setSidebarVisible] = useState(DEFAULT_SETTINGS.sidebarVisible);
  const [emailNotifications, setEmailNotificationsState] = useState(DEFAULT_SETTINGS.emailNotifications);
  const [evaluationReminders, setEvaluationRemindersState] = useState(DEFAULT_SETTINGS.evaluationReminders);
  const [reminderDaysBefore, setReminderDaysBeforeState] = useState(DEFAULT_SETTINGS.reminderDaysBefore);
  const [chatbotEnabled, setChatbotEnabledState] = useState(DEFAULT_SETTINGS.chatbotEnabled);
  const [autoSuggestions, setAutoSuggestionsState] = useState(DEFAULT_SETTINGS.autoSuggestions);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setDarkMode(settings.darkMode ?? DEFAULT_SETTINGS.darkMode);
        setSidebarVisible(settings.sidebarVisible ?? DEFAULT_SETTINGS.sidebarVisible);
        setEmailNotificationsState(settings.emailNotifications ?? DEFAULT_SETTINGS.emailNotifications);
        setEvaluationRemindersState(settings.evaluationReminders ?? DEFAULT_SETTINGS.evaluationReminders);
        setReminderDaysBeforeState(settings.reminderDaysBefore ?? DEFAULT_SETTINGS.reminderDaysBefore);
        setChatbotEnabledState(settings.chatbotEnabled ?? DEFAULT_SETTINGS.chatbotEnabled);
        setAutoSuggestionsState(settings.autoSuggestions ?? DEFAULT_SETTINGS.autoSuggestions);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  const saveSettings = () => {
    const settings = {
      darkMode,
      sidebarVisible,
      emailNotifications,
      evaluationReminders,
      reminderDaysBefore,
      chatbotEnabled,
      autoSuggestions,
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
  };

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        sidebarVisible,
        emailNotifications,
        evaluationReminders,
        reminderDaysBefore,
        chatbotEnabled,
        autoSuggestions,
        toggleDarkMode,
        toggleSidebar,
        setEmailNotifications: setEmailNotificationsState,
        setEvaluationReminders: setEvaluationRemindersState,
        setReminderDaysBefore: setReminderDaysBeforeState,
        setChatbotEnabled: setChatbotEnabledState,
        setAutoSuggestions: setAutoSuggestionsState,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
