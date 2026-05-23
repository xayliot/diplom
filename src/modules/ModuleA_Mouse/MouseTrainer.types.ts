export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Position {
  x: number;
  y: number;
}

export interface Target extends Position {
  visibilityDuration: number;
  appearanceTime: number;
  id: string;
  radius: number;
  color?: string;
  isActive?: boolean;
  isHit?: boolean;
}

export interface MouseLevel {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  targetCount: number;
  targetSize: number;
  timeLimit?: number;
  isMoving?: boolean;
  requiredAccuracy: number;
  showTrajectory?: boolean;
  requiredAttempts?: number; 
}
export interface MouseTrainerProps {
  level: MouseLevel;
  onComplete: (accuracy: number, time: number) => void;
  onExit: () => void;
  className?: string;
}

export interface LevelState {
  targets: Target[];
  hits: number;
  misses: number;
  startTime: number;
  elapsedTime: number;
  isCompleted: boolean;
}