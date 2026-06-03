import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../../hooks/useUserProgress';
import { KEYBOARD_LEVELS } from '../../config/levelConfig';

export const KeyboardModulePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useUserProgress();

  const getLevelStatus = (difficulty: number) => {
    if (!progress) return 'available';
    const kbProgress = progress.completedModules.keyboard;
    if (kbProgress.completed && kbProgress.currentLevel >= difficulty) return 'completed';
    if (difficulty <= kbProgress.currentLevel + 1) return 'available';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-8 shadow-sm">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/modules')}
            className="text-green-600 hover:text-green-800 mb-6 font-bold flex items-center gap-2 transition-transform hover:-translate-x-1"
          >
            ← К модулям
          </button>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Модуль Б: Клавиатура</h1>
          <p className="text-slate-500 mt-2 text-lg">Развивайте скорость и точность печати шаг за шагом.</p>
          
          {progress && (
            <div className="mt-6 bg-green-50 border border-green-100 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="font-bold text-green-800 uppercase text-xs tracking-widest">Ваш прогресс</h2>
                <p className="text-green-600 font-black text-xl">
                  Точность: {progress.completedModules.keyboard.accuracy}% | 
                  WPM: {progress.completedModules.keyboard.currentLevel * 15}
                </p>
              </div>
              <div className="text-4xl">⌨️</div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {KEYBOARD_LEVELS.map((level) => {
          const status = getLevelStatus(level.difficulty);
          
          return (
            <div
              key={level.id}
              className={`bg-white rounded-4xl shadow-xl overflow-hidden flex flex-col h-full border border-slate-100 transition-all ${
                status === 'locked' ? 'opacity-60 grayscale' : 'hover:-translate-y-2 hover:shadow-2xl'
              }`}
            >
              <div className={`h-32 p-6 flex items-start justify-between ${
                status === 'completed' ? 'bg-green-500' : 
                status === 'locked' ? 'bg-slate-400' : 'bg-green-600'
              }`}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                  {level.difficulty}
                </div>
                {status === 'completed' && <span className="text-3xl text-white">🏆</span>}
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{level.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{level.description}</p>
                  
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Цель WPM:</span>
                      <span className="text-slate-700">{level.targetWpm}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Точность:</span>
                      <span className="text-green-600">{level.minAccuracy}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/module/keyboard/${level.id}`)}
                  disabled={status === 'locked'}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all mt-8 ${
                    status === 'locked' 
                      ? 'bg-slate-100 text-slate-400' 
                      : 'bg-green-600 text-white shadow-lg shadow-green-100 hover:bg-green-700 active:scale-95'
                  }`}
                >
                  {status === 'locked' ? 'Заблокировано' : 
                   status === 'completed' ? 'Повторить' : 'Начать'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};