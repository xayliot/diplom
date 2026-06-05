import React, { useEffect, useState, useRef} from 'react';
import type { LevelProps } from './levels.types';
import type { Position, Target } from '../MouseTrainer.types';
import { generateCenteredTargets } from '../utils/targetGenerator';

export const Level2_ClickStatic: React.FC<LevelProps> = ({
  level,
  onTargetHit,
  onTargetMiss,
  onComplete,
  isActive
}) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [allTargets] = useState<Target[]>(() => 
    generateCenteredTargets({
      count: level.targetCount,
      radius: 2.5,
      containerWidth: 100,
      containerHeight: 100
    }, 0.5)
  );
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [missFeedback, setMissFeedback] = useState<{show: boolean; position: Position | null}>({
    show: false,
    position: null
  });
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [showStartPrompt, setShowStartPrompt] = useState(true);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [startTime] = useState(Date.now());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout>>(0);

  const TARGET_LIFETIME = 5000;
  const SPAWN_DELAY = 2000;

  useEffect(() => {
    if (!isActive) {
      setTargets([]);
      setCurrentIndex(0);
      setHitCount(0);
      setMissCount(0);
      setMissFeedback({ show: false, position: null });
      setShowStartPrompt(true);
      setIsLevelComplete(false);
      return;
    }

    const spawnNext = () => {
      if (currentIndex < allTargets.length) {
        const newTarget = {
          ...allTargets[currentIndex],
          id: `target-${Date.now()}-${Math.random()}`,
          isActive: true,
          appearanceTime: Date.now(),
          visibilityDuration: TARGET_LIFETIME
        };
        
        setTargets(prev => [...prev, newTarget]);
        setCurrentIndex(prev => prev + 1);
        setShowStartPrompt(false);
        
        spawnTimerRef.current = setTimeout(spawnNext, SPAWN_DELAY + TARGET_LIFETIME);
      }
    };

    spawnTimerRef.current = setTimeout(spawnNext, SPAWN_DELAY);

    return () => {
      clearTimeout(spawnTimerRef.current);
    };
  }, [isActive, currentIndex, allTargets]);

  useEffect(() => {
    if (!isActive) return;

    const checkExpired = setInterval(() => {
      const now = Date.now();
      setTargets(prev => {
        const expired = prev.filter(t => 
          t.isActive && (now - (t.appearanceTime || 0)) > TARGET_LIFETIME
        );
        
        if (expired.length > 0) {
          setMissCount(prev => prev + expired.length);
          expired.forEach(() => onTargetMiss());
        }
        
        return prev.filter(t => !(t.isActive && (now - (t.appearanceTime || 0)) > TARGET_LIFETIME));
      });
    }, 100);

    return () => clearInterval(checkExpired);
  }, [isActive, onTargetMiss]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const clickPos = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      };
      
      const hitTarget = targets.find(target => {
        if (!target.isActive) return false;
        
        const distance = Math.sqrt(
          Math.pow(clickPos.x - target.x, 2) + 
          Math.pow(clickPos.y - target.y, 2)
        );
        return distance < target.radius;
      });
      
      if (hitTarget) {
        setTargets(prev => prev.filter(t => t.id !== hitTarget.id));
        setHitCount(prev => prev + 1);
        onTargetHit(hitTarget.id);
      } else {
        setMissFeedback({ show: true, position: clickPos });
        setMissCount(prev => prev + 1);
        onTargetMiss();
        
        setTimeout(() => {
          setMissFeedback({ show: false, position: null });
        }, 500);
      }
    };

    const container = containerRef.current;
    container.addEventListener('mousedown', handleMouseDown);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isActive, targets, onTargetHit, onTargetMiss]);

  useEffect(() => {
    if (currentIndex === allTargets.length && targets.length === 0 && !isLevelComplete) {
      setIsLevelComplete(true);
      
      const totalAttempts = hitCount + missCount;
      const accuracy = totalAttempts > 0 ? (hitCount / totalAttempts) * 100 : 0;
      const timeElapsed = (Date.now() - startTime) / 1000;
      
      onComplete({ accuracy, timeElapsed });
    }
  }, [currentIndex, allTargets.length, targets.length, hitCount, missCount, isLevelComplete, onComplete, startTime]);

  const activeCount = targets.filter(t => t.isActive).length;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-125 bg-gray-100 rounded-lg overflow-hidden cursor-default"
    >
      {targets.filter(t => t.isActive).map(target => (
        <div
          key={target.id}
          className="absolute bg-green-500 shadow-2xl transition-all duration-200 animate-pulse hover:scale-110 hover:shadow-3xl hover:ring-4 hover:ring-green-300"
          style={{
            left: `${target.x - target.radius}%`,
            top: `${target.y - target.radius}%`,
            width: `${target.radius * 2}%`,
            height: `${target.radius * 2}%`,
            borderRadius: '50%',
            minWidth: '28px',
            minHeight: '28px',
            maxWidth: '48px',
            maxHeight: '48px',
            boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.4)'
          }}
        />
      ))}

      {missFeedback.show && missFeedback.position && (
        <div
          className="absolute z-10"
          style={{
            left: `${missFeedback.position.x}%`,
            top: `${missFeedback.position.y}%`,
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

      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-10 w-80 border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{level.title}</h3>
        <p className="text-gray-700 text-base mb-4">{level.description}</p>
        
        <div className="mt-6 space-y-4">
          <div>
            <div className="text-lg font-semibold text-gray-800 mb-3">Прогресс:</div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex justify-between text-base mb-2">
                <span className="text-gray-700">Попаданий:</span>
                <span className="font-bold text-green-700 text-xl">{hitCount}</span>
              </div>
              <div className="flex justify-between text-base mb-2">
                <span className="text-gray-700">Промахов:</span>
                <span className="font-bold text-red-600 text-xl">{missCount}</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-blue-200">
                <span className="text-gray-700">Точность:</span>
                <span className="font-bold text-blue-700 text-xl">
                  {hitCount + missCount > 0 ? Math.round((hitCount / (hitCount + missCount)) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-lg font-semibold text-gray-800 mb-2">Цели:</div>
            <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden">
              <div 
                className="bg-green-600 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-xs text-white font-bold"
                style={{ width: `${(hitCount / allTargets.length) * 100}%` }}
              >
                {hitCount}/{allTargets.length}
              </div>
            </div>
            <div className="text-base text-gray-700 mt-2">
              Активных целей: <span className="font-bold text-green-600">{activeCount}</span>
            </div>
          </div>

          {level.requiredAccuracy && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">Целевая точность:</div>
              <div className="text-2xl font-bold text-gray-700">{level.requiredAccuracy}%</div>
            </div>
          )}
        </div>
      </div>

      {showStartPrompt && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 
          bg-yellow-100 text-yellow-800 px-8 py-4 rounded-xl shadow-2xl animate-pulse z-20 text-xl font-bold border-2 border-yellow-300">
          ⏳ Цели скоро появятся...
        </div>
      )}

      {activeCount > 0 && !isLevelComplete && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
          bg-yellow-100 text-yellow-800 px-8 py-4 rounded-xl shadow-2xl animate-pulse z-20 text-xl font-bold border-2 border-yellow-300">
          👆 Нажимайте на зелёные цели!
        </div>
      )}
    </div>
  );
};