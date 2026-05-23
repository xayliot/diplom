export interface CollisionResult {
  isHit: boolean;
  targetId?: string;
  distance?: number;
}

export interface TargetGeneratorConfig {
  count: number;
  radius: number;
  containerWidth: number;
  containerHeight: number;
  isMoving?: boolean;
  speed?: number;
  biasToCenter?: boolean;
  centerZone?: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
}

export interface ProgressiveSpawnConfig {
  enabled: boolean;
  initialDelay?: number;
  interval: number;
  maxConcurrent?: number;
}

export interface ProgressiveTargetsResult {
  targets: Target[];
  getNextTarget: (currentIndex: number) => Target | null;
}

import type { Target, Position } from '../MouseTrainer.types';
export type { Target, Position };