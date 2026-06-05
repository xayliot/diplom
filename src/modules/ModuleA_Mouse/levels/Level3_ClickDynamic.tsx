import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { LevelProps } from './levels.types';
import type { Position, Target } from '../MouseTrainer.types';

interface MovingTarget extends Target {
  velocity: Position;
}

export const Level3_ClickDynamic: React.FC<LevelProps> = ({
  level,
  onTargetHit,
  onTargetMiss,
  onComplete,
  isActive
}) => {
  const [targets, setTargets] = useState<MovingTarget[]>([]);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [spawnedCount, setSpawnedCount] = useState(0);
  const [missFeedback, setMissFeedback] = useState<{show: boolean; x: number; y: number} | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [startTime] = useState(Date.now);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout>>(0);
  const targetIdCounter = useRef(0);
  const spawnedCountRef = useRef(0);

  const TOTAL_TARGETS = level.targetCount || 12;
  const TARGET_RADIUS = 40;
  const MOVE_SPEED = 2.5;

  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  const generateRandomPosition = useCallback(() => {
    const padding = TARGET_RADIUS + 50;
    const maxX = containerSize.width - padding;
    const maxY = containerSize.height - padding;
    return {
      x: padding + Math.random() * (maxX - padding),
      y: padding + Math.random() * (maxY - padding)
    };
  }, [containerSize]);

  const generateRandomVelocity = useCallback((): Position => {
    const angle = Math.random() * Math.PI * 2;
    const speed = MOVE_SPEED * (0.8 + Math.random() * 0.4);
    return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
  }, []);

  const spawnTarget = useCallback(() => {
    if (spawnedCountRef.current >= TOTAL_TARGETS) return;
    
    const position = generateRandomPosition();
    const newTarget: MovingTarget = {
      id: `target-${targetIdCounter.current++}`,
      x: position.x,
      y: position.y,
      radius: TARGET_RADIUS,
      isActive: true,
      isHit: false,
      velocity: generateRandomVelocity(),
      appearanceTime: Date.now(),
      visibilityDuration: 8000
    };
    
    setTargets(prev => [...prev, newTarget]);
    spawnedCountRef.current += 1;
    setSpawnedCount(spawnedCountRef.current);
    
    if (spawnedCountRef.current < TOTAL_TARGETS) {
      const delay = 1000 + Math.random() * 1000;
      spawnTimerRef.current = setTimeout(spawnTarget, delay);
    }
  }, [TOTAL_TARGETS, generateRandomPosition, generateRandomVelocity]);

  const updateTargetPositions = useCallback(() => {
    setTargets(prev => prev.map(target => {
      if (target.isHit) return target;
      
      let newX = target.x + target.velocity.x;
      let newY = target.y + target.velocity.y;
      let newVelX = target.velocity.x;
      let newVelY = target.velocity.y;
      
      if (newX < TARGET_RADIUS || newX > containerSize.width - TARGET_RADIUS) {
        newVelX *= -1;
        newX = target.x;
      }
      if (newY < TARGET_RADIUS || newY > containerSize.height - TARGET_RADIUS) {
        newVelY *= -1;
        newY = target.y;
      }
      
      return { ...target, x: newX, y: newY, velocity: { x: newVelX, y: newVelY } };
    }));
  }, [containerSize]);

  useEffect(() => {
    if (!isActive) {
      setTargets([]);
      setHitCount(0);
      setMissCount(0);
      setSpawnedCount(0);
      spawnedCountRef.current = 0;
      setIsLevelComplete(false);
      setMissFeedback(null);
      return;
    }
    
    const animate = () => {
      updateTargetPositions();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    const startTimeout = setTimeout(spawnTarget, 1000);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(spawnTimerRef.current);
      clearTimeout(startTimeout);
    };
  }, [isActive, spawnTarget, updateTargetPositions]);

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (!isActive || isLevelComplete) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const hitIndex = targets.findIndex(t => {
      if (t.isHit) return false;
      const dist = Math.sqrt((clickX - t.x) ** 2 + (clickY - t.y) ** 2);
      return dist <= t.radius;
    });

    if (hitIndex !== -1) {
      const hitTarget = targets[hitIndex];
      setTargets(prev => prev.filter(t => t.id !== hitTarget.id)); 
      setHitCount(prev => prev + 1);
      onTargetHit(hitTarget.id);
    } else {
      setMissCount(prev => prev + 1);
      onTargetMiss();
      setMissFeedback({ show: true, x: clickX, y: clickY });
      setTimeout(() => setMissFeedback(null), 200);
    }
  };

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setTargets(prev => {
        const expired = prev.filter(t => !t.isHit && (now - t.appearanceTime) > 6000);
        if (expired.length > 0) {
          setMissCount(c => c + expired.length);
          expired.forEach(() => onTargetMiss());
          return prev.filter(t => !expired.find(e => e.id === t.id));
        }
        return prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isActive, onTargetMiss]);

  useEffect(() => {
    if (spawnedCount === TOTAL_TARGETS && targets.length === 0 && !isLevelComplete && spawnedCount > 0) {
      setIsLevelComplete(true);
      
      const totalAttempts = hitCount + missCount;
      const accuracy = totalAttempts > 0 ? (hitCount / totalAttempts) * 100 : 0;
      const timeElapsed = (Date.now() - startTime) / 1000;
      
      onComplete({ accuracy, timeElapsed });
    }
  }, [targets, spawnedCount, TOTAL_TARGETS, isLevelComplete, hitCount, missCount, onComplete, startTime]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleContainerMouseDown}
      className="relative w-full h-full min-h-125 bg-gray-100 rounded-lg overflow-hidden cursor-default select-none"
    >
      {targets.map(target => (
        <div
          key={target.id}
          className="absolute bg-green-500 shadow-xl border-2 border-white pointer-events-none"
          style={{
            left: target.x - target.radius,
            top: target.y - target.radius,
            width: target.radius * 2,
            height: target.radius * 2,
            borderRadius: '50%',
            transition: 'transform 0.1s ease-out'
          }}
        />
      ))}

      {missFeedback && (
        <div
          className="absolute z-10"
          style={{
            left: `${missFeedback.x}px`,
            top: `${missFeedback.y}px`,
            width: '40px',
            height: '40px',
            marginLeft: '-20px',
            marginTop: '-20px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            border: '3px solid rgb(239, 68, 68)',
            animation: 'ping 0.5s ease-out'
          }}
        />
      )}

      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-10 w-80 border-2 border-gray-200 pointer-events-none">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{level.description}</p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 font-bold uppercase">Попадания</span>
              <span className="text-xl font-black text-green-700">{hitCount}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 font-bold uppercase">Промахи</span>
              <span className="text-xl font-black text-red-600">{missCount}</span>
            </div>
            <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
              <span className="text-sm text-gray-500 font-bold uppercase">Точность</span>
              <span className="text-xl font-black text-blue-700">
                {hitCount + missCount > 0 ? Math.round((hitCount / (hitCount + missCount)) * 100) : 0}%
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Прогресс уровня</p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-300">
              <div 
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${(spawnedCount / TOTAL_TARGETS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {!isLevelComplete && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-yellow-100 border-2 border-yellow-300 px-6 py-2 rounded-full text-yellow-800 font-bold text-sm uppercase tracking-widest shadow-lg animate-pulse">
            🎯 Уничтожьте все движущиеся цели
          </div>
        </div>
      )}
    </div>
  );
};