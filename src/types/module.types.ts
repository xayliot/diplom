export interface BaseLevel {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeLimit?: number; // в секундах, опционально
}

export interface MouseLevel extends BaseLevel {
  targetSize: number; // px
  targetCount: number;
  isMoving: boolean;
  requiredAccuracy: number; // 0-100
}

export interface KeyboardLevel extends BaseLevel {
  targetKeys: string[];
  words: string[];
  useShift?: boolean;
}

export interface GUIScenario extends BaseLevel {
  steps: ScenarioStep[];
  targetAction: string;
}

type ScenarioStep = {
  id: string;
  title: string;
  completed: boolean;
};