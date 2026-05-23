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

  const TOTAL_TARGETS = 10;
  const TARGET_RADIUS = 30;
  const MAX_TARGET_LIFETIME = 2000; // 2 секунды на реакцию

  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    if (isStarted) {
      updateContainerSize();
      window.addEventListener('resize', updateContainerSize);
      return () => window.removeEventListener('resize', updateContainerSize);
    }
  }, [isStarted, updateContainerSize]);

  const endDiagnostic = useCallback(() => {
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
    // Если отспавнили все мишени — завершаем
    if (statsRef.current.spawned >= TOTAL_TARGETS) {
      endDiagnostic();
      return;
    }

    // Отступы от краев экрана, чтобы мишень не появилась наполовину за границей
    const padding = TARGET_RADIUS + 40; 
    const maxX = containerSize.width - padding * 2;
    const maxY = containerSize.height - padding * 2;

    setTarget({
      x: padding + Math.random() * maxX,
      y: padding + Math.random() * maxY,
      spawnTime: Date.now()
    });

    statsRef.current.spawned += 1;

    // Таймер промаха (если не успел кликнуть)
    spawnTimerRef.current = setTimeout(() => {
      statsRef.current.misses += 1;
      setTarget(null);
      setTimeout(spawnTarget, 200); 
    }, MAX_TARGET_LIFETIME);
  }, [containerSize, endDiagnostic]);

  const startGame = () => {
    setIsStarted(true);
    statsRef.current = { hits: 0, misses: 0, totalReactionTime: 0, spawned: 0 };
    // Даем маленькую задержку перед первой мишенью, чтобы игрок подготовился
    setTimeout(spawnTarget, 800);
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    // Если клик произошел по кнопке "Прервать тест", игнорируем механику мишеней
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (!isStarted || !target) return;

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
    setTimeout(spawnTarget, 200 + Math.random() * 300);
  };

  useEffect(() => {
    return () => clearTimeout(spawnTimerRef.current);
  }, []);

  // --- РЕНДЕР ИГРОВОЙ ЗОНЫ НА ВЕСЬ ЭКРАН ---
  if (isStarted) {
    return (
      <div 
        ref={containerRef}
        onMouseDown={handleContainerMouseDown}
        // fixed inset-0 z-50 перекрывает всё окно браузера
        className="fixed inset-0 z-50 bg-slate-900 cursor-crosshair select-none overflow-hidden animate-in fade-in duration-300"
      >
        {/* Кнопка прерывания (на всякий случай) */}
        <button 
          onClick={() => setIsStarted(false)}
          className="absolute top-8 right-8 text-slate-500 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors z-10"
        >
          Прервать тест (Esc)
        </button>

        {/* Прогресс-бар сверху слева */}
        <div className="absolute top-8 left-8 flex gap-3 z-10">
          {Array.from({ length: TOTAL_TARGETS }).map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                i < statsRef.current.spawned ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-700'
              }`} 
            />
          ))}
        </div>

        {/* Сама мишень */}
        {target && (
          <div
            className="absolute bg-indigo-500 border-[6px] border-white shadow-[0_0_30px_rgba(99,102,241,0.8)] animate-in zoom-in-50 duration-150 pointer-events-none"
            style={{
              left: target.x - TARGET_RADIUS,
              top: target.y - TARGET_RADIUS,
              width: TARGET_RADIUS * 2,
              height: TARGET_RADIUS * 2,
              borderRadius: '50%',
            }}
          >
            {/* Внутренняя точка для прицеливания */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-80" />
          </div>
        )}
      </div>
    );
  }

  // --- РЕНДЕР ЭКРАНА ПРИВЕТСТВИЯ ---
  return (
    <div className="max-w-4xl mx-auto p-12 text-center h-full flex flex-col justify-center animate-in fade-in duration-500">
      <div className="mb-12">
        <span className="text-7xl mb-6 block drop-shadow-lg">🖱️</span>
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          Проверка владения мышью
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
          Тест откроется на весь экран. Появится {TOTAL_TARGETS} мишеней. Кликайте по ним максимально быстро и точно. 
          Промахи и долгие раздумья снижают итоговый балл.
        </p>
      </div>
      <div>
        <button 
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-200"
        >
          Развернуть и начать
        </button>
      </div>
    </div>
  );
};