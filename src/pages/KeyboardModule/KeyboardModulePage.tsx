import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KeyboardTrainer } from '../../modules/ModuleB_Keyboard/KeyboardTrainer';
import { useUserProgress } from '../../hooks/useUserProgress';
import { KEYBOARD_LEVELS } from '../../config/levelConfig';


export const KeyboardLevelPage: React.FC = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { updateModuleProgress } = useUserProgress();

  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState({ accuracy: 0, wpm: 0 });

  const levelIndex = KEYBOARD_LEVELS.findIndex(l => String(l.id) === levelId);
  const level = KEYBOARD_LEVELS[levelIndex];

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <button onClick={() => navigate('/module/keyboard')} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg">
          Назад к списку
        </button>
      </div>
    );
  }

  const handleLevelComplete = (stats: { accuracy: number, wpm: number }) => {
    setResults({ accuracy: stats.accuracy, wpm: stats.wpm });
    setIsFinished(true);

    updateModuleProgress('keyboard', {
      currentLevel: level.difficulty,
      accuracy: stats.accuracy,
      completed: stats.accuracy >= level.minAccuracy && stats.wpm >= level.targetWpm
    });
  };

  const handleNextLevel = () => {
    const nextLevel = KEYBOARD_LEVELS[levelIndex + 1];
    if (nextLevel) {
      setIsFinished(false);
      navigate(`/module/keyboard/${nextLevel.id}`);
    } else {
      navigate('/module/keyboard');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden relative">
      <div className="bg-slate-900 text-white py-4 px-8 flex items-center justify-between border-b-4 border-green-500 z-10">
        <button
          onClick={() => navigate('/module/keyboard')}
          className="flex items-center gap-2 hover:text-green-400 transition-colors font-bold uppercase text-xs tracking-widest"
        >
          <span>← Прервать</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500" 
              style={{ width: `${(level.difficulty / KEYBOARD_LEVELS.length) * 100}%` }} 
            />
          </div>
          <span className="font-black text-sm uppercase tracking-tighter">
            {level.title}
          </span>
        </div>

        <div className="w-20" />
      </div>

      <div className="flex-1 relative overflow-y-auto">
        <KeyboardTrainer 
          level={level} 
          onComplete={handleLevelComplete} 
        />

        {isFinished && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md px-4">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border-4 border-green-500 text-center max-w-sm w-full">
              <div className="text-6xl mb-6">🏆</div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase">Готово!</h2>
              
              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="bg-green-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Точность</div>
                  <div className="text-3xl font-black text-green-600">{results.accuracy}%</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Скорость</div>
                  <div className="text-3xl font-black text-blue-600">{results.wpm} <span className="text-sm">WPM</span></div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {results.accuracy >= level.minAccuracy && levelIndex < KEYBOARD_LEVELS.length - 1 ? (
                  <button 
                    onClick={handleNextLevel}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
                  >
                    Далее
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/module/keyboard')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all"
                  >
                    В меню
                  </button>
                )}
                <button 
                  onClick={() => { setIsFinished(false); window.location.reload(); }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Еще раз
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};