export type UserLevel = 'beginner' | 'intermediate' | 'advanced';
export type ModuleId = 'mouse' | 'keyboard' | 'gui';


export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface UserSettings {
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high';
  soundEnabled: boolean;
  soundVolume: number;
  showHints: boolean;
  autoAdvance: boolean;
}

export interface ModuleProgress {
  moduleId: ModuleId;
  currentLevel: number;
  maxLevel: number;
  accuracy: number;
  completed: boolean;
  bestTime?: number;
  attempts?: number; 
}

export interface UserProgress {
  userId: string;
  userName: string;
  
  // Новые поля для диагностики и общей статы
  diagnosticCompleted: boolean;
  overallLevel: number;
  overallAccuracy: number;
  typingSpeed: number;
  totalXp: number;
  
  // Тренды (разница с прошлым результатом)
  accuracyTrend?: number;
  speedTrend?: number;
  
  // Для быстрого продолжения
  lastActiveModule?: string;
  lastActiveModuleId?: ModuleId;
  lastSessionMinutes?: number;

  // Твои существующие поля
  completedModules: Record<ModuleId, ModuleProgress>;
  achievements: Achievement[];
  settings: UserSettings;
  lastActive: Date;
  createdAt: Date;
}

// Вспомогательный тип для маппинга в SkillMap (если нужно)
export interface SkillData {
  level: number;
  xp: number;
}