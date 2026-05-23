import React, { useState, useCallback } from 'react';
import * as Scenarios from './scenarios';
import { SimulatedDesktop } from './components/SimulatedDesktop';
import type { GUIStats } from './GUITrainer.types';

interface GUITrainerProps {
  level: { id: string | number; title: string; };
  onComplete: (stats: GUIStats) => void;
}

export const GUITrainer: React.FC<GUITrainerProps> = ({ level, onComplete }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentWindows, setCurrentWindows] = useState<any>({});
  const [lastFocusedId, setLastFocusedId] = useState<string | null>(null);

  const handleComplete = (stats: GUIStats) => {
    setIsStarted(false);
    setCurrentWindows({});
    setLastFocusedId(null);
    onComplete(stats);
  };

  const syncWindows = useCallback((windows: any) => {
    setCurrentWindows(windows);
  }, []);

  const renderScenario = () => {
    const commonProps = {
      isActive: isStarted,
      onComplete: handleComplete,
      onSyncWindows: syncWindows,
      externalFocusId: lastFocusedId
    };

    const levelKey = level.id.toString();
    switch (levelKey) {
      case '1':
      case 'g1':
        return <Scenarios.Scenario1_FileSave {...commonProps} />;
      case '2':
      case 'g2':
        return <Scenarios.Scenario2_WindowControl {...commonProps} />;
      case '3':
      case 'g3':
        return <Scenarios.Scenario3_BrowserSearch {...commonProps} />;
      default:
        return <div className="p-20 text-white text-center">Сценарий в разработке...</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans h-full flex flex-col">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-4xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Интерфейс системы</h2>
          <p className="text-slate-400 font-bold text-sm">{level.title}</p>
        </div>
        {!isStarted && (
          <button onClick={() => setIsStarted(true)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">
            Запустить
          </button>
        )}
      </div>

      <div className="flex-1 bg-slate-900 rounded-[48px] p-3 shadow-2xl relative border-12 border-slate-800 overflow-hidden min-h-[620px]">
        {isStarted ? (
          <SimulatedDesktop 
            windows={currentWindows} 
            onTaskbarClick={(id) => {
              // Посылаем сигнал фокусировки
              setLastFocusedId(id);
              // Быстро сбрасываем, чтобы можно было кликнуть повторно по тому же окну
              setTimeout(() => setLastFocusedId(null), 50);
            }}
          >
            {renderScenario()}
          </SimulatedDesktop>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-20 text-center">
            <button onClick={() => setIsStarted(true)} className="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest">
              Начать обучение
            </button>
          </div>
        )}
      </div>
    </div>
  );
};