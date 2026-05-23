import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GUITrainer } from '../../modules/ModuleC_GUI/GUITrainer';
import { GUI_LEVELS } from '../../config/levelConfig';
import { useUserProgress } from '../../hooks/useUserProgress';
import type { GUIStats } from '../../modules/ModuleC_GUI/GUITrainer.types';

export const GuiLevelPage: React.FC = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { progress, updateModuleProgress } = useUserProgress();

  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState({ accuracy: 0, time: 0 });

  const levelIndex = GUI_LEVELS.findIndex(l => String(l.id) === levelId);
  const level = GUI_LEVELS[levelIndex];

  // Если уровень не найден
  if (!level || !progress) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <button 
          onClick={() => navigate('/module/gui')} 
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
        >
          К списку сценариев
        </button>
      </div>
    );
  }

  const handleLevelComplete = (stats: GUIStats) => {
    const accuracy = stats.accuracy;
    const timeElapsed = stats.timeElapsed;
    
    setResults({ accuracy, time: timeElapsed });
    setIsFinished(true);

    const currentLevelNum = levelIndex + 1;
    const isModuleCompleted = currentLevelNum >= progress.completedModules.gui.maxLevel && accuracy >= 80;

    // ИСПРАВЛЕННЫЙ ВЫЗОВ: передаем только те поля, которые есть в ModuleProgress
    updateModuleProgress('gui', {
      currentLevel: currentLevelNum,
      accuracy: accuracy,
      completed: isModuleCompleted,
      attempts: (progress.completedModules.gui.attempts || 0) + 1
    });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Верхняя навигация */}
      <div className="bg-slate-800 text-white py-4 px-8 flex items-center justify-between border-b border-white/10 z-10">
        <button 
          onClick={() => navigate('/module/gui')}
          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          ← Выйти из симуляции
        </button>
        <span className="font-bold text-blue-400 uppercase tracking-tight">
          {level.title}
        </span>
        <div className="w-24" /> 
      </div>

      <div className="flex-1 relative overflow-hidden">
        <GUITrainer 
          level={level} 
          onComplete={handleLevelComplete} 
        />

        {/* Модалка завершения */}
        {isFinished && (
          <div className="absolute inset-0 z-100 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500 p-4">
            <div className="bg-white p-12 rounded-[48px] shadow-2xl text-center max-w-md w-full border-8 border-blue-500/20">
              <div className="text-7xl mb-6">🎯</div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Отлично!</h2>
              <p className="text-slate-500 font-medium mb-8">Сценарий успешно завершен</p>
              
              <div className="bg-slate-50 p-6 rounded-3xl mb-8 flex justify-around">
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Точность</div>
                  <div className="text-3xl font-black text-blue-600">{results.accuracy}%</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Время</div>
                  <div className="text-3xl font-black text-slate-800">{Math.round(results.time)}с</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/module/gui')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
                >
                  К списку уровней
                </button>
                <button 
                  onClick={() => {
                    setIsFinished(false);
                    // Здесь можно добавить логику сброса состояния сценария в GUITrainer, если нужно
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Попробовать снова
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};