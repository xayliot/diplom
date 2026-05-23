import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { TrackingLevelProps } from './levels.types';
import type { Position } from '../MouseTrainer.types';
import { generateTrajectory } from '../utils/targetGenerator';

export const Level1_Tracking: React.FC<TrackingLevelProps> = ({
  level,
  onTargetHit,
  onTargetMiss,
  onComplete,
  isActive
}) => {
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const [currentPoint, setCurrentPoint] = useState(0);
  const [attempts, setAttempts] = useState<{trajectory: Position[]}[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [wasOnTrajectory, setWasOnTrajectory] = useState(false);
  const [isTrajectoryActive, setIsTrajectoryActive] = useState(false);
  const [exits, setExits] = useState(0);
  const [showStartPrompt, setShowStartPrompt] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const REQUIRED_ATTEMPTS = level?.requiredAttempts || 3;
  const TRAJECTORY_RADIUS = 45; 
  const START_POINT_RADIUS = 35;

  // Инициализация при старте или смене уровня
  const initLevels = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const data = Array.from({ length: REQUIRED_ATTEMPTS }, () => {
      const start = { x: 450, y: 150 + Math.random() * (rect.height - 300) };
      const end = { x: rect.width - 100, y: 150 + Math.random() * (rect.height - 300) };
      const base = generateTrajectory(start, end, 150);
      return {
        trajectory: base.map((p, i) => ({
          x: p.x,
          y: p.y + Math.sin(i * 0.1) * 40
        }))
      };
    });
    setAttempts(data);
    setCurrentAttempt(0);
    setCurrentPoint(0);
    setExits(0);
    setIsTrajectoryActive(false);
    setShowStartPrompt(true);
  }, [REQUIRED_ATTEMPTS]);

  useEffect(() => {
    if (isActive && attempts.length === 0) {
      initLevels();
    }
  }, [isActive, attempts.length, initLevels]);

  const currentTrajectory = attempts[currentAttempt]?.trajectory || [];

  // Движение мыши
  useEffect(() => {
    if (!isActive) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  // Старт по клику на зеленую зону
  const handleMouseDown = useCallback(() => {
    if (!isActive || isTrajectoryActive || !currentTrajectory[0]) return;
    const dist = Math.sqrt(Math.pow(mousePos.x - currentTrajectory[0].x, 2) + Math.pow(mousePos.y - currentTrajectory[0].y, 2));
    if (dist < START_POINT_RADIUS) {
      setIsTrajectoryActive(true);
      setShowStartPrompt(false);
      setWasOnTrajectory(true);
      onTargetHit(`start-${currentAttempt}`);
    }
  }, [isActive, currentTrajectory, isTrajectoryActive, mousePos, currentAttempt, onTargetHit]);

  useEffect(() => {
    const el = containerRef.current;
    if (isActive && el) {
      el.addEventListener('mousedown', handleMouseDown);
      return () => el.removeEventListener('mousedown', handleMouseDown);
    }
  }, [isActive, handleMouseDown]);

  // Основной цикл проверки позиции
  useEffect(() => {
    if (!isActive || !isTrajectoryActive || !currentTrajectory.length) return;

    // 1. Проверка нахождения "в колее"
    const p = mousePos;
    let minDistance = Infinity;
    for (let i = 0; i < currentTrajectory.length - 1; i++) {
      const a = currentTrajectory[i], b = currentTrajectory[i+1];
      const l2 = Math.pow(b.x-a.x, 2) + Math.pow(b.y-a.y, 2);
      const t = Math.max(0, Math.min(1, ((p.x-a.x)*(b.x-a.x) + (p.y-a.y)*(b.y-a.y)) / l2));
      const dist = Math.sqrt(Math.pow(p.x-(a.x+t*(b.x-a.x)), 2) + Math.pow(p.y-(a.y+t*(b.y-a.y)), 2));
      if (dist < minDistance) minDistance = dist;
    }

    if (minDistance > TRAJECTORY_RADIUS && wasOnTrajectory) {
      setExits(v => v + 1);
      onTargetMiss();
      setWasOnTrajectory(false);
    } else if (minDistance <= TRAJECTORY_RADIUS) {
      setWasOnTrajectory(true);
    }

    // 2. Проверка прогресса (движение к следующей точке)
    const distToTarget = Math.sqrt(Math.pow(mousePos.x - currentTrajectory[currentPoint].x, 2) + Math.pow(mousePos.y - currentTrajectory[currentPoint].y, 2));
    if (distToTarget < TRAJECTORY_RADIUS) {
      if (currentPoint < currentTrajectory.length - 1) {
        setCurrentPoint(prev => prev + 1);
      } else {
        // Трасса завершена
        setIsTrajectoryActive(false);
        if (currentAttempt < REQUIRED_ATTEMPTS - 1) {
          // Переход к следующей попытке внутри уровня
          setCurrentAttempt(v => v + 1);
          setCurrentPoint(0);
          setShowStartPrompt(true);
          onTargetHit(`complete-attempt-${currentAttempt}`);
        } else {
          // ВСЕ попытки пройдены -> отдаем управление родителю
          onComplete(); 
        }
      }
    }
  }, [mousePos, isActive, isTrajectoryActive, currentTrajectory, currentPoint, currentAttempt, REQUIRED_ATTEMPTS, wasOnTrajectory, onTargetMiss, onComplete, onTargetHit]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-125 bg-gray-50 rounded-xl overflow-hidden select-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Отрисовка траектории */}
        <polyline
          points={currentTrajectory.map(p => `${p.x},${p.y}`).join(' ')}
          className={`stroke-4 fill-none transition-colors duration-500 ${isTrajectoryActive ? 'stroke-blue-400/20' : 'stroke-gray-200'}`}
        />
        
        {/* Точка-гайд (куда вести) */}
        {isTrajectoryActive && currentTrajectory[currentPoint] && (
          <g>
            <circle cx={currentTrajectory[currentPoint].x} cy={currentTrajectory[currentPoint].y} r="12" className="fill-blue-500/30" />
            <circle cx={currentTrajectory[currentPoint].x} cy={currentTrajectory[currentPoint].y} r="6" className="fill-blue-600" />
          </g>
        )}

        {/* Индикатор старта */}
        {!isTrajectoryActive && currentTrajectory[0] && (
          <circle cx={currentTrajectory[0].x} cy={currentTrajectory[0].y} r={START_POINT_RADIUS} className="fill-green-500/20 animate-pulse" />
        )}
      </svg>

      {/* Левая панель статистики */}
      <div className="absolute left-8 top-8 bottom-8 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl z-10 w-80 flex flex-col justify-between border border-gray-100">
        <div>
          <h3 className="text-2xl font-black text-gray-800 mb-1">{level.title}</h3>
          <p className="text-sm text-gray-400 mb-8 italic">Модуль: Слежение</p>
          
          <div className="space-y-6">
            <div className="flex gap-1.5">
              {Array.from({ length: REQUIRED_ATTEMPTS }).map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < currentAttempt ? 'bg-green-500' : i === currentAttempt ? 'bg-blue-500 shadow-lg' : 'bg-gray-100'}`} />
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Выходы с линии</span>
              <span className="text-3xl font-black text-gray-700">{exits}</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-bold text-gray-300 uppercase leading-tight">
          Удерживайте курсор на синей точке и ведите вдоль линии
        </div>
      </div>

      {showStartPrompt && !isTrajectoryActive && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold animate-bounce shadow-2xl z-20">
          КЛИКНИ НА СТАРТ 🟢
        </div>
      )}
    </div>
  );
};