import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type UserSettings } from '../types/settings';

const DEFAULT_SETTINGS: UserSettings = {
  mouseSpeed: 5,
  cursorSize: 'medium',
  fontSize: 'normal',
  soundEnabled: true,
  soundVolume: 70,
  highContrast: false,
  animationSpeed: 'normal',
  language: 'ru',
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('user_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

function applySettings(settings: UserSettings) {
  const root = document.documentElement;


  const fontSizeMap = {
    'normal': '16px',
    'large': '20px',
    'extra-large': '24px',
  };
  root.style.fontSize = fontSizeMap[settings.fontSize];


  const cursorSizeMap = {
    'small': 'default',
    'medium': 'url(/cursors/medium.cur), auto',
    'large': 'url(/cursors/large.cur), auto',
  };
  document.body.style.cursor = cursorSizeMap[settings.cursorSize];


  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }


  const animationSpeedMap = {
    'slow': '0.5s',
    'normal': '0.3s',
    'fast': '0.15s',
  };
  root.style.setProperty('--animation-speed', animationSpeedMap[settings.animationSpeed]);
}