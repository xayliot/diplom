import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUserProgress } from '../hooks/useUserProgress';
import { MouseTrainer } from '../modules/ModuleA_Mouse/MouseTrainer';
import { KeyboardTrainer } from '../modules/ModuleB_Keyboard/KeyboardTrainer';
import { GUITrainer } from '../modules/ModuleC_GUI/GUITrainer';
import { 
  mouseLevels, 
  KEYBOARD_LEVELS, 
  GUI_LEVELS 
} from '../config/levelConfig';

type ModuleType = 'mouse' | 'keyboard' | 'gui';

interface ModuleConfig {
  levels: any[];
  trainer: React.ComponentType<any>;
  backPath: string;
  backLabel: string;
  colorScheme: {
    primary: string;
    bg: string;
    headerBg: string;
  };
}

const MODULE_CONFIGS: Record<ModuleType, ModuleConfig> = {
  mouse: {
    levels: mouseLevels,
    trainer: MouseTrainer,
    backPath: '/module/mouse',
    backLabel: 'В меню',
    colorScheme: {
      primary: 'blue',
      bg: 'slate-50',
      headerBg: 'slate-900'
    }
  },
  keyboard: {
    levels: KEYBOARD_LEVELS,
    trainer: KeyboardTrainer,
    backPath: '/module/keyboard',
    backLabel: 'К модулям',
    colorScheme: {
      primary: 'green',
      bg: 'gray-50',
      headerBg: 'slate-900'
    }
  },
  gui: {
    levels: GUI_LEVELS,
    trainer: GUITrainer,
    backPath: '/module/gui',
    backLabel: 'К списку сценариев',
    colorScheme: {
      primary: 'blue',
      bg: 'slate-900',
      headerBg: 'slate-800'
    }
  }
};

interface LevelResult {
  accuracy: number;
  time: number;
}

export const LevelPage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, updateModuleProgress } = useUserProgress();
  
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<LevelResult>({ accuracy: 0, time: 0 });
  const [attemptKey, setAttemptKey] = useState(0); // Ключ для пересоздания компонента
  
  const pathParts = location.pathname.split('/');
  const moduleType = pathParts[2] as ModuleType;
  
  const config = MODULE_CONFIGS[moduleType];
  
  if (!config || !moduleType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Модуль не найден</h2>
          <button
            onClick={() => navigate('/modules')}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold"
          >
            К списку модулей
          </button>
        </div>
      </div>
    );
  }
  
  const { levels, trainer: TrainerComponent, backPath, backLabel, colorScheme } = config;
  
  const levelIndex = levels.findIndex((l: any) => String(l.id) === levelId);
  const level = levels[levelIndex];
  
  const handleRetry = useCallback(() => {
    setIsFinished(false);
    setResults({ accuracy: 0, time: 0 });
    setAttemptKey(prev => prev + 1); // Меняем ключ для пересоздания
  }, []);
  
  const handleBack = useCallback(() => {
    navigate(backPath);
  }, [navigate, backPath]);
  
  if (!level || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-12 rounded-4xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Уровень не найден</h2>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            {backLabel}
          </button>
        </div>
      </div>
    );
  }
  
 const handleLevelComplete = (result: any) => {
    let accuracy = 0;
    let time = 0;
    
    if (typeof result === 'number') {
      accuracy = result;
    } else if (result && typeof result === 'object') {
      accuracy = result.accuracy || 0;
      time = result.timeElapsed || result.time || 0;
    }
    
    const roundedAccuracy = Math.round(accuracy);
    setResults({ accuracy: roundedAccuracy, time });
    setIsFinished(true);
    
    const passedRequiredAccuracy = roundedAccuracy >= (level.requiredAccuracy || 80);
    
    // currentLevel повышаем только если пройдено успешно
    const newLevel = passedRequiredAccuracy ? levelIndex + 1 : progress.completedModules[moduleType].currentLevel;
    
    updateModuleProgress(moduleType, {
      currentLevel: newLevel,
      accuracy: roundedAccuracy,
      completed: passedRequiredAccuracy,
      attempts: (progress.completedModules[moduleType]?.attempts || 0) + 1,
      levelId: String(level.id) // ← ДОБАВЛЕНО
    });
  };
  
  const handleNextLevel = () => {
    const nextLevel = levels[levelIndex + 1];
    if (nextLevel) {
      setIsFinished(false);
      setResults({ accuracy: 0, time: 0 });
      setAttemptKey(prev => prev + 1); // Меняем ключ
      navigate(`/module/${moduleType}/${nextLevel.id}`);
    } else {
      navigate(backPath);
    }
  };
  
  const isLastLevel = levelIndex === levels.length - 1;
  const passedRequiredAccuracy = results.accuracy >= (level.requiredAccuracy || 80);
  
  return (
    <div className={`h-screen flex flex-col bg-${colorScheme.bg} overflow-hidden relative`}>
      <div className={`bg-${colorScheme.headerBg} text-white py-4 px-8 flex items-center justify-between border-b-4 border-${colorScheme.primary}-600 z-10`}>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 hover:text-blue-400 transition-colors font-bold uppercase text-xs tracking-widest"
        >
          <span>← {backLabel}</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
            <div 
              className={`h-full bg-${colorScheme.primary}-500 transition-all duration-500`} 
              style={{ width: `${((levelIndex + 1) / levels.length) * 100}%` }} 
            />
          </div>
          <span className="font-black text-sm uppercase tracking-tight">
            Уровень {levelIndex + 1}: {level.title}
          </span>
        </div>
        
        <div className="w-20" />
      </div>
      
      <div className="flex-1 relative">
        <TrainerComponent
          key={`${moduleType}-${levelId}-${attemptKey}`} // Ключ для пересоздания
          level={level}
          onComplete={handleLevelComplete}
          onExit={handleBack}
        />
        
        {isFinished && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-fade-in px-4">
            <div className={`bg-white p-10 rounded-[40px] shadow-2xl border-4 border-${colorScheme.primary}-500 text-center max-w-sm w-full`}>
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase">Результат</h2>
              <p className="text-slate-400 font-medium mb-8">Точность прохождения уровня</p>
              
              <div className={`bg-${colorScheme.primary}-50 p-6 rounded-3xl mb-8`}>
                <div className={`text-xs font-bold text-${colorScheme.primary}-400 uppercase tracking-widest mb-1`}>Точность</div>
                <div className={`text-5xl font-black text-${colorScheme.primary}-600`}>{results.accuracy}%</div>
                {results.time > 0 && (
                  <>
                    <div className="w-full h-px bg-slate-200 my-4" />
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Время</div>
                    <div className="text-3xl font-black text-slate-800">{Math.round(results.time)}с</div>
                  </>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                {passedRequiredAccuracy && !isLastLevel ? (
                  <button 
                    onClick={handleNextLevel}
                    className={`w-full bg-${colorScheme.primary}-600 hover:bg-${colorScheme.primary}-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95`}
                  >
                    Следующий уровень
                  </button>
                ) : (
                  <button 
                    onClick={handleBack}
                    className={`w-full bg-${colorScheme.primary}-600 hover:bg-${colorScheme.primary}-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all`}
                  >
                    В главное меню
                  </button>
                )}
                <button 
                  onClick={handleRetry}
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