import type { Position, Target } from '../MouseTrainer.types';
import type { CollisionResult } from './mouse.utils.types';

export const checkCollision = (
  mousePos: Position,
  target: Target
): boolean => {
  const distance = Math.sqrt(
    Math.pow(mousePos.x - target.x, 2) + Math.pow(mousePos.y - target.y, 2)
  );
  return distance <= target.radius;
};

export const findHitTarget = (
  mousePos: Position,
  targets: Target[]
): CollisionResult => {
  for (const target of targets) {
    if (!target.isActive || target.isHit) continue;
    
    if (checkCollision(mousePos, target)) {
      return {
        isHit: true,
        targetId: target.id,
        distance: Math.sqrt(
          Math.pow(mousePos.x - target.x, 2) + Math.pow(mousePos.y - target.y, 2)
        )
      };
    }
  }
  
  return { isHit: false };
};