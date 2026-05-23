import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MouseTrainer } from '../../modules/ModuleA_Mouse/MouseTrainer';
import { mouseLevels } from '../../config/levelConfig';
import { useUserProgress } from '../../hooks/useUserProgress';

export const LevelPage: React.FC = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { updateModuleProgress } = useUserProgress();
  
  const [isFinished, setIsFinished] = useState(false);
  const [finalAccuracy, setFinalAccuracy] = useState(0);

  const levelIndex = mouseLevels.findIndex(l => l.id === levelId);
  const level = mouseLevels[levelIndex];

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-12 rounded-4xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Уровень не найден</h2>
          <button
            onClick={() => navigate('/module/mouse')}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Вернуться в меню
          </button>
        </div>
      </div>
    );
  }

  const handleLevelComplete = (accuracy: number) => {
    setFinalAccuracy(Math.round(accuracy));
    setIsFinished(true);
    
    updateModuleProgress('mouse', {
      currentLevel: level.difficulty,
      accuracy: Math.round(accuracy),
      completed: accuracy >= level.requiredAccuracy
    });
  };

  const handleNextLevel = () => {
    const nextLevel = mouseLevels[levelIndex + 1];
    if (nextLevel) {
      setIsFinished(false);
      navigate(`/module/mouse/${nextLevel.id}`);
    } else {
      navigate('/module/mouse');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden relative">
      <div className="bg-slate-900 text-white py-4 px-8 flex items-center justify-between border-b-4 border-blue-600 z-10">
        <button
          onClick={() => navigate('/module/mouse')}
          className="flex items-center gap-2 hover:text-blue-400 transition-colors font-bold uppercase text-xs tracking-widest"
        >
          <span>← В меню</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${(level.difficulty / mouseLevels.length) * 100}%` }} 
            />
          </div>
          <span className="font-black text-sm uppercase tracking-tight">
            Уровень {level.difficulty}: {level.title}
          </span>
        </div>

        <div className="w-20" />
      </div>

      <div className="flex-1 relative">
        <MouseTrainer
          level={level}
          onComplete={handleLevelComplete}
          onExit={() => navigate('/module/mouse')}
        />

        {isFinished && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-fade-in px-4">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border-4 border-blue-500 text-center max-w-sm w-full">
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase">Результат</h2>
              <p className="text-slate-400 font-medium mb-8">Точность прохождения уровня</p>
              
              <div className="bg-blue-50 p-6 rounded-3xl mb-8">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Точность</div>
                <div className="text-5xl font-black text-blue-600">{finalAccuracy}%</div>
              </div>

              <div className="flex flex-col gap-3">
                {finalAccuracy >= level.requiredAccuracy && levelIndex < mouseLevels.length - 1 ? (
                  <button 
                    onClick={handleNextLevel}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95"
                  >
                    Следующий уровень
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/module/mouse')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all"
                  >
                    В главное меню
                  </button>
                )}
                <button 
                  onClick={() => { setIsFinished(false); window.location.reload(); }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Повторить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};