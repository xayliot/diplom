import type { Target, Position } from '../MouseTrainer.types';
import type { TargetGeneratorConfig } from './mouse.utils.types';

export const generateStaticTargets = (config: TargetGeneratorConfig): Target[] => {
  const { 
    count, 
    radius, 
    containerWidth, 
    containerHeight,
    biasToCenter = false,
    centerZone
  } = config;
  
  const targets: Target[] = [];
  
  let minX: number, maxX: number, minY: number, maxY: number;
  
  if (biasToCenter && centerZone) {
    minX = Math.max(centerZone.xMin, radius);
    maxX = Math.min(centerZone.xMax, containerWidth - radius);
    minY = Math.max(centerZone.yMin, radius);
    maxY = Math.min(centerZone.yMax, containerHeight - radius);
  } else {
    const padding = radius;
    minX = padding;
    maxX = containerWidth - padding;
    minY = padding;
    maxY = containerHeight - padding;
  }
  
  if (minX >= maxX || minY >= maxY) {
    console.warn('Center zone is too small, falling back to full area');
    const padding = radius;
    minX = padding;
    maxX = containerWidth - padding;
    minY = padding;
    maxY = containerHeight - padding;
  }
  
  const appearanceDelay = 500;
  const visibilityDuration = 3000;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    
    targets.push({
      id: `target-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      x,
      y,
      radius,
      isActive: i === 0,
      isHit: false,
      color: i === 0 ? '#22c55e' : '#3b82f6',
      appearanceTime: now + (i * appearanceDelay),
      visibilityDuration: visibilityDuration
    });
  }
  
  return shuffleArray(targets).map((target, index) => ({
    ...target,
    isActive: index === 0,
    color: index === 0 ? '#22c55e' : '#3b82f6'
  }));
};

export const generateTrajectory = (
  start: Position,
  end: Position,
  steps: number = 20
): Position[] => {
  const points: Position[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t
    });
  }
  return points;
};

export const generateCenteredTargets = (
  config: TargetGeneratorConfig,
  centerBias: number = 0.3
): Target[] => {
  const { containerWidth, containerHeight } = config;
  
  const centerWidth = containerWidth * centerBias;
  const centerHeight = containerHeight * centerBias;
  
  const centerZone = {
    xMin: (containerWidth - centerWidth) / 2,
    xMax: (containerWidth + centerWidth) / 2,
    yMin: (containerHeight - centerHeight) / 2,
    yMax: (containerHeight + centerHeight) / 2
  };
  
  return generateStaticTargets({
    ...config,
    biasToCenter: true,
    centerZone
  });
};

export const generateProgressiveTargets = (
  config: TargetGeneratorConfig,
): {
  targets: Target[];
  getNextTarget: (currentIndex: number) => Target | null;
  updateTargets: (currentTime: number) => Target[];
} => {
  const allTargets = generateStaticTargets(config);
  
  const getNextTarget = (currentIndex: number) => {
    return currentIndex < allTargets.length - 1 ? allTargets[currentIndex + 1] : null;
  };
  
  const updateTargets = (currentTime: number) => {
    return allTargets.map(target => {
      if (target.isHit) return { ...target, isActive: false };
      
      const timeSinceAppearance = currentTime - (target.appearanceTime || 0);
      const isExpired = timeSinceAppearance > (target.visibilityDuration || 3000);
      
      return {
        ...target,
        isActive: target.isActive && !isExpired
      };
    });
  };
  
  return {
    targets: allTargets,
    getNextTarget,
    updateTargets
  };
};

export const isInCenterZone = (
  position: Position,
  containerWidth: number,
  containerHeight: number,
  threshold: number = 0.3
): boolean => {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const zoneWidth = containerWidth * threshold;
  const zoneHeight = containerHeight * threshold;
  
  return Math.abs(position.x - centerX) < zoneWidth / 2 &&
         Math.abs(position.y - centerY) < zoneHeight / 2;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateWeightedTargets = (
  config: TargetGeneratorConfig,
  centerWeight: number = 0.7
): Target[] => {
  const { count, radius, containerWidth, containerHeight } = config;
  const targets: Target[] = [];
  
  const centerZone = {
    xMin: containerWidth * 0.3,
    xMax: containerWidth * 0.7,
    yMin: containerHeight * 0.3,
    yMax: containerHeight * 0.7
  };
  
  const appearanceDelay = 500;
  const visibilityDuration = 3000;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    
    if (Math.random() < centerWeight) {
      x = centerZone.xMin + Math.random() * (centerZone.xMax - centerZone.xMin);
      y = centerZone.yMin + Math.random() * (centerZone.yMax - centerZone.yMin);
    } else {
      const padding = radius;
      x = padding + Math.random() * (containerWidth - padding * 2);
      y = padding + Math.random() * (containerHeight - padding * 2);
    }
    
    targets.push({
      id: `target-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      x,
      y,
      radius,
      isActive: i === 0,
      isHit: false,
      color: i === 0 ? '#22c55e' : '#3b82f6',
      appearanceTime: now + (i * appearanceDelay),
      visibilityDuration: visibilityDuration
    });
  }
  
  return shuffleArray(targets);
};

export const updateTargetsState = (
  targets: Target[],
  currentTime: number
): Target[] => {
  return targets.map(target => {
    if (target.isHit) {
      return { ...target, isActive: false };
    }
    
    const timeSinceAppearance = currentTime - (target.appearanceTime || 0);
    const isExpired = timeSinceAppearance > (target.visibilityDuration || 3000);
    
    if (isExpired) {
      return { ...target, isActive: false };
    }
    
    const shouldBeActive = timeSinceAppearance >= 0 && !isExpired;
    
    return {
      ...target,
      isActive: shouldBeActive,
      color: shouldBeActive ? '#22c55e' : '#3b82f6'
    };
  });
};

export const getNextActiveTarget = (targets: Target[]): Target | null => {
  const now = Date.now();
  const activeTarget = targets.find(t => {
    if (t.isHit) return false;
    const timeSinceAppearance = now - (t.appearanceTime || 0);
    return timeSinceAppearance >= 0 && timeSinceAppearance < (t.visibilityDuration || 3000);
  });
  return activeTarget || null;
};