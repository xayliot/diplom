import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, ModuleId, UserSettings, Achievement } from '../types/user.types';

const defaultSettings: UserSettings = {
  fontSize: 'medium',
  contrast: 'normal',
  soundEnabled: true,
  soundVolume: 70,
  showHints: true,
  autoAdvance: false
};

const defaultAchievements: Achievement[] = [];

const defaultProgress: UserProgress = {
  userId: 'user-1',
  userName: 'Пользователь',
  
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
      attempts: 0,
      levelAccuracies: {}
    },
    keyboard: {
      moduleId: 'keyboard',
      currentLevel: 1,
      maxLevel: 4,
      accuracy: 0,
      completed: false,
      attempts: 0,
      levelAccuracies: {}
    },
    gui: {
      moduleId: 'gui',
      currentLevel: 1,
      maxLevel: 3,
      accuracy: 0,
      completed: false,
      attempts: 0,
      levelAccuracies: {}
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
        parsed.lastActive = new Date(parsed.lastActive);
        parsed.createdAt = new Date(parsed.createdAt);
        
        Object.keys(parsed.completedModules).forEach(key => {
          if (!parsed.completedModules[key].levelAccuracies) {
            parsed.completedModules[key].levelAccuracies = {};
          }
        });
        
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
      overallAccuracy: results.mouse.accuracy,
      typingSpeed: results.keyboard.wpm,
      lastActive: new Date()
    };
    
    setProgress(updated);
    localStorage.setItem(`progress_${userId}`, JSON.stringify(updated));
  };

const updateModuleProgress = useCallback((moduleType: ModuleId, data: {
  currentLevel?: number;
  accuracy?: number;
  completed?: boolean;
  attempts?: number;
  levelId?: string;
}) => {
  setProgress(prev => {
    if (!prev) return prev;
    
    const moduleProgress = prev.completedModules[moduleType];
    const newCurrentLevel = data.currentLevel !== undefined 
      ? Math.max(moduleProgress.currentLevel, data.currentLevel)  // ← НЕ УМЕНЬШАЕМ!
      : moduleProgress.currentLevel;
    
    const updated: UserProgress = {
      ...prev,
      completedModules: {
        ...prev.completedModules,
        [moduleType]: {
          ...moduleProgress,
          currentLevel: newCurrentLevel,  // ← используем защищённое значение
          accuracy: data.accuracy ?? moduleProgress.accuracy,
          completed: data.completed ?? moduleProgress.completed,
          attempts: data.attempts ?? moduleProgress.attempts,
          levelAccuracies: {
            ...moduleProgress.levelAccuracies,
            ...(data.levelId && data.accuracy !== undefined 
              ? { [data.levelId]: data.accuracy } 
              : {}
            )
          }
        }
      }
    };
    
    localStorage.setItem(`progress_${userId}`, JSON.stringify(updated));
    return updated;
  });
}, [userId]);

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

  const unlockAchievement = (_achievementId: string) => {
    if (!progress) return;
    
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