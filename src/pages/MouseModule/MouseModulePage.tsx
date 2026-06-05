import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mouseLevels } from '../../config/levelConfig';
import { useUserProgress } from '../../hooks/useUserProgress';

export const MouseModulePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useUserProgress();

  const getLevelStatus = (levelDifficulty: number) => {
    if (!progress) return levelDifficulty === 1 ? 'available' : 'locked';
    
    const mouseProgress = progress.completedModules.mouse;
    
    if (mouseProgress.currentLevel >= levelDifficulty) {
      return 'completed';
    }
    
    if (levelDifficulty === mouseProgress.currentLevel + 1) {
      return 'available';
    }
    
    if (levelDifficulty === 1 && mouseProgress.currentLevel === 0) {
      return 'available';
    }
    
    return 'locked';
  };

  const getAverageAccuracy = () => {
    if (!progress) return 0;
    
    const mouseProgress = progress.completedModules.mouse;
    const levelAccuracies: Record<string, number> = mouseProgress.levelAccuracies || {};
    
    const completedLevels = mouseLevels.filter(
      level => mouseProgress.currentLevel >= level.difficulty
    );
    
    if (completedLevels.length === 0) return 0;
    
    const totalAccuracy = completedLevels.reduce((sum, level) => {
      return sum + (levelAccuracies[level.id] || 0);
    }, 0);
    
    return Math.round(totalAccuracy / completedLevels.length);
  };

  const getCompletedLevelsCount = () => {
    if (!progress) return 0;
    const mouseProgress = progress.completedModules.mouse;
    return mouseLevels.filter(level => mouseProgress.currentLevel >= level.difficulty).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/modules')}
            className="text-blue-600 hover:text-blue-800 mb-4 font-bold flex items-center gap-2 transition-transform hover:-translate-x-1 text-lg"
          >
            <span className="text-xl">←</span> К модулям
          </button>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Модуль А: Мышь
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Освойте точное наведение, клики и перетаскивание объектов.
          </p>
          
          {progress && (
            <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="font-bold text-blue-800 uppercase text-sm tracking-widest mb-1">Ваш прогресс</h2>
                <p className="text-blue-600 font-black text-lg">
                  Средняя точность: {getAverageAccuracy()}% | Пройдено: {getCompletedLevelsCount()}/{mouseLevels.length}
                </p>
              </div>
              <div className="text-3xl">🖱️</div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mouseLevels.map((level) => {
          const status = getLevelStatus(level.difficulty);
          
          return (
            <div
              key={level.id}
              className={`
                bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col h-full border border-slate-100 transition-all 
                ${status === 'locked' ? 'opacity-60 grayscale' : 'hover:-translate-y-2 hover:shadow-xl'}
              `}
            >
              <div className={`
                h-28 p-5 flex items-start justify-between 
                ${status === 'completed' ? 'bg-emerald-500' : status === 'locked' ? 'bg-slate-400' : 'bg-blue-600'}
              `}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white text-2xl font-black">
                  {level.difficulty}
                </div>
                {status === 'completed' && <span className="text-3xl text-white">✅</span>}
                {status === 'locked' && <span className="text-3xl text-white">🔒</span>}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{level.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{level.description}</p>
                  
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Целей:</span>
                      <span className="text-slate-700">{level.targetCount}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>Сложность:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((d) => (
                          <div key={d} className={`w-2 h-2 rounded-full ${d <= level.difficulty ? 'bg-blue-500' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    {level.requiredAccuracy && (
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span>Точность:</span>
                        <span className="text-slate-700">{level.requiredAccuracy}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/module/mouse/${level.id}`)}
                  disabled={status === 'locked'}
                  className={`
                    w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all mt-4 
                    ${status === 'locked' 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : status === 'completed'
                        ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700 active:scale-95'
                        : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
                    }
                  `}
                >
                  {status === 'locked' ? 'Закрыто' : status === 'completed' ? 'Повторить' : 'Начать'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="container mx-auto px-6 pb-8">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="font-bold text-amber-900 text-lg mb-1 tracking-tight">Совет по координации</h4>
            <p className="text-amber-700 text-base leading-relaxed">
              Не пытайтесь двигать мышь слишком быстро. На начальных этапах важнее довести курсор до цели без лишних движений.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};