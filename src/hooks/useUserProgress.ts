import { useState, useEffect } from 'react';
import type { UserProgress, ModuleId, ModuleProgress, UserSettings, Achievement } from '../types/user.types';

// Настройки по умолчанию
const defaultSettings: UserSettings = {
  fontSize: 'medium',
  contrast: 'normal',
  soundEnabled: true,
  soundVolume: 70,
  showHints: true,
  autoAdvance: false
};

// Достижения по умолчанию (пустой массив)
const defaultAchievements: Achievement[] = [];

const defaultProgress: UserProgress = {
  userId: 'user-1',
  userName: 'Пользователь',
  
  // Инициализация новых полей
  diagnosticCompleted: false,
  overallLevel: 1,
  overallAccuracy: 0,
  typingSpeed: 0,
  totalXp: 0,
  lastSessionMinutes: 0,
  
  completedModules: {
    mouse: {
      moduleId: 'mouse',
      currentLevel: 1,
      maxLevel: 4,
      accuracy: 0,
      completed: false,
      attempts: 0
    },
    keyboard: {
      moduleId: 'keyboard',
      currentLevel: 1,
      maxLevel: 4,
      accuracy: 0,
      completed: false,
      attempts: 0
    },
    gui: {
      moduleId: 'gui',
      currentLevel: 1,
      maxLevel: 3,
      accuracy: 0,
      completed: false,
      attempts: 0
    }
  },
  achievements: defaultAchievements,
  settings: defaultSettings,
  lastActive: new Date(),
  createdAt: new Date()
};

export const useUserProgress = (userId: string = 'user-1') => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(`progress_${userId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Восстанавливаем даты из строк
        parsed.lastActive = new Date(parsed.lastActive);
        parsed.createdAt = new Date(parsed.createdAt);
        setProgress(parsed);
      } catch (e) {
        console.error('Ошибка загрузки прогресса:', e);
        setProgress(defaultProgress);
      }
    } else {
      setProgress(defaultProgress);
      localStorage.setItem(`progress_${userId}`, JSON.stringify(defaultProgress));
    }
    setLoading(false);
  }, [userId]);

  const saveDiagnosticResults = (results: any) => {
  if (!progress) return;
  
  const updated: UserProgress = {
    ...progress,
    diagnosticCompleted: true,
    overallAccuracy: results.mouse.accuracy, // берем как базовый
    typingSpeed: results.keyboard.wpm,
    // Навыки (skills) в Dashboard мы теперь будем вычислять из completedModules
    lastActive: new Date()
  };
  
  setProgress(updated);
  localStorage.setItem(`progress_${userId}`, JSON.stringify(updated));
};
  const updateModuleProgress = (moduleId: ModuleId, data: Partial<ModuleProgress>) => {
    if (!progress) return;
    
    const updated = {
      ...progress,
      completedModules: {
        ...progress.completedModules,
        [moduleId]: {
          ...progress.completedModules[moduleId],
          ...data
        }
      },
      lastActive: new Date()
    };
    
    setProgress(updated);
    localStorage.setItem(`progress_${userId}`, JSON.stringify(updated));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    if (!progress) return;
    
    const updated = {
      ...progress,
      settings: {
        ...progress.settings,
        ...newSettings
      },
      lastActive: new Date()
    };
    
    setProgress(updated);
    localStorage.setItem(`progress_${userId}`, JSON.stringify(updated));
  };

  const unlockAchievement = (achievementId: string) => {
    if (!progress) return;
    
    // Здесь можно добавить логику поиска достижения по ID
    // или получение из конфига
    
    const updated = {
      ...progress,
      lastActive: new Date()
    };
    
    setProgress(updated);
    localStorage.setItem(`progress_${userId}`, JSON.stringify(updated));
  };

return { 
  progress, 
  loading, 
  updateModuleProgress,
  updateSettings,
  unlockAchievement,
  saveDiagnosticResults,
  setProgress 
};
};