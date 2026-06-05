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
  levelAccuracies: Record<string, number>;
}

export interface UserProgress {
  userId: string;
  userName: string;
  
  diagnosticCompleted: boolean;
  overallLevel: number;
  overallAccuracy: number;
  typingSpeed: number;
  totalXp: number;
  
  accuracyTrend?: number;
  speedTrend?: number;
  
  lastActiveModule?: string;
  lastActiveModuleId?: ModuleId;
  lastSessionMinutes?: number;

  completedModules: Record<ModuleId, ModuleProgress>;
  achievements: Achievement[];
  settings: UserSettings;
  lastActive: Date;
  createdAt: Date;
}

export interface SkillData {
  level: number;
  xp: number;
}