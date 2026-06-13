import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { StepProps } from './diagnostics.steps.types';
import type { MouseData } from '../Diagnostics.types';

export const Step1_Mouse: React.FC<StepProps<MouseData>> = ({ onComplete }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [target, setTarget] = useState<{ x: number; y: number; spawnTime: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef({ hits: 0, misses: 0, totalReactionTime: 0, spawned: 0 });
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout>>(0);
  const isActiveRef = useRef(false);

  const TOTAL_TARGETS = 10;
  const TARGET_RADIUS = 30;
  const SAFE_MARGIN = TARGET_RADIUS + 20;

  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
      return { width: rect.width, height: rect.height };
    }
    return { width: 0, height: 0 };
  }, []);

  const endDiagnostic = useCallback(() => {
    if (!isActiveRef.current) return;
    
    isActiveRef.current = false;
    setIsStarted(false);
    setTarget(null);
    clearTimeout(spawnTimerRef.current);

    const { hits, misses, totalReactionTime } = statsRef.current;
    const totalAttempts = hits + misses;
    
    const accuracy = totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 0;
    const averageSpeedMs = hits > 0 ? totalReactionTime / hits : 2000;
    const speedInSeconds = Number((averageSpeedMs / 1000).toFixed(2));

    onComplete({ accuracy, speed: speedInSeconds });
  }, [onComplete]);

  const spawnTarget = useCallback(() => {
    if (!isActiveRef.current) return;
    
    if (statsRef.current.spawned >= TOTAL_TARGETS) {
      endDiagnostic();
      return;
    }

    let width = containerSize.width;
    let height = containerSize.height;
    
    if (width === 0 || height === 0) {
      const sizes = updateContainerSize();
      width = sizes.width;
      height = sizes.height;
    }

    if (width === 0 || height === 0) {
      setTimeout(spawnTarget, 50);
      return;
    }

    const minX = SAFE_MARGIN;
    const maxX = width - SAFE_MARGIN;
    const minY = SAFE_MARGIN;
    const maxY = height - SAFE_MARGIN;

    let newX, newY;

    if (maxX <= minX || maxY <= minY) {
      newX = width / 2;
      newY = height / 2;
    } else {
      newX = minX + Math.random() * (maxX - minX);
      newY = minY + Math.random() * (maxY - minY);
    }

    setTarget({
      x: newX,
      y: newY,
      spawnTime: Date.now()
    });

    statsRef.current.spawned += 1;

    spawnTimerRef.current = setTimeout(() => {
      if (!isActiveRef.current) return;
      statsRef.current.misses += 1;
      setTarget(null);
      setTimeout(() => spawnTarget(), 200);
    }, 2000);
  }, [containerSize, updateContainerSize, endDiagnostic]);

  const startGame = () => {
    statsRef.current = { hits: 0, misses: 0, totalReactionTime: 0, spawned: 0 };
    setTarget(null);
    isActiveRef.current = true;
    setIsStarted(true);
    
    setTimeout(() => {
      const sizes = updateContainerSize();
      setContainerSize(sizes);
      spawnTarget();
    }, 150);
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (!isActiveRef.current || !target) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const dist = Math.sqrt((clickX - target.x) ** 2 + (clickY - target.y) ** 2);

    clearTimeout(spawnTimerRef.current);

    if (dist <= TARGET_RADIUS) {
      statsRef.current.hits += 1;
      statsRef.current.totalReactionTime += (Date.now() - target.spawnTime);
    } else {
      statsRef.current.misses += 1;
    }

    setTarget(null);
    setTimeout(() => spawnTarget(), 200 + Math.random() * 300);
  };

  useEffect(() => {
    if (isStarted && containerRef.current) {
      updateContainerSize();
      
      window.addEventListener('resize', () => {
        updateContainerSize();
      });
      
      return () => {
        window.removeEventListener('resize', updateContainerSize);
      };
    }
  }, [isStarted, updateContainerSize]);

  useEffect(() => {
    return () => {
      clearTimeout(spawnTimerRef.current);
      isActiveRef.current = false;
    };
  }, []);

  if (isStarted) {
    return (
      <div 
        ref={containerRef}
        onMouseDown={handleContainerMouseDown}
        className="fixed inset-0 z-50 bg-slate-900 cursor-crosshair select-none overflow-hidden"
      >
        <button 
          onClick={() => {
            isActiveRef.current = false;
            setIsStarted(false);
            clearTimeout(spawnTimerRef.current);
          }}
          className="absolute top-8 right-8 text-slate-500 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors z-10"
        >
          Прервать тест
        </button>

        <div className="absolute top-8 left-8 flex gap-3 z-10">
          {Array.from({ length: TOTAL_TARGETS }).map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                i < statsRef.current.spawned ? 'bg-indigo-500' : 'bg-slate-700'
              }`} 
            />
          ))}
        </div>

        {target && (
          <div
            className="absolute bg-indigo-500 border-[6px] border-white shadow-[0_0_30px_rgba(99,102,241,0.8)] pointer-events-none"
            style={{
              left: target.x - TARGET_RADIUS,
              top: target.y - TARGET_RADIUS,
              width: TARGET_RADIUS * 2,
              height: TARGET_RADIUS * 2,
              borderRadius: '50%',
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-80" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-12 text-center h-full flex flex-col justify-center">
      <div className="mb-12">
        <span className="text-7xl mb-6 block">🖱️</span>
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          Проверка владения мышью
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
          Тест откроется на весь экран. Появится {TOTAL_TARGETS} мишеней. Кликайте по ним максимально быстро и точно.
        </p>
      </div>
      <div>
        <button 
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl"
        >
          Развернуть и начать
        </button>
      </div>
    </div>
  );
};