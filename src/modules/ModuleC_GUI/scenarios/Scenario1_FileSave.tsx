import React, { useState } from 'react';
import { SimulatedWindow, SimulatedMenu, Tooltip } from '../components';
import type { GUIScenarioProps } from '../GUITrainer.types';

export const Scenario1_FileSave: React.FC<GUIScenarioProps> = ({ onComplete, isActive }) => {
  const [step, setStep] = useState(0);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState(0);
  const [startTime] = useState(Date.now());

  const steps = [
    "Запустите 'Редактор' (иконка с блокнотом)",
    "Введите текст: 'Привет мир'",
    "Откройте меню 'Файл' и выберите 'Сохранить'",
    "Введите имя 'note.txt' и нажмите кнопку в окне"
  ];

  const handleError = () => isActive && setErrors(prev => prev + 1);

  const handleFinish = () => {
    onComplete({
      timeElapsed: (Date.now() - startTime) / 1000,
      accuracy: Math.max(0, 100 - (errors * 10)),
      errors,
      completedSteps: 4
    });
  };

  const menuItems = {
    "Файл": [
      { 
        label: "Сохранить", 
        onClick: () => {
          if (step === 2 && textContent.toLowerCase() === 'привет мир') setStep(3);
          else handleError();
        } 
      },
      { label: "Открыть", disabled: true },
    ],
    "Справка": [
      { label: "О программе" }
    ]
  };

  // Возвращаем фрагмент <>, так как SimulatedDesktop уже есть в родителе (GUITrainer)
  return (
    <>
      <Tooltip step={step + 1} text={steps[step]} />

      {/* Иконки на рабочем столе */}
      {!isAppOpen && (
        <div className="absolute top-10 left-10 grid grid-cols-1 gap-10">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-14 h-14 cursor-pointer rounded-xl hover:bg-white/20 flex items-center justify-center text-3xl transition-all active:scale-95 shadow-lg border border-white/10"
              onClick={() => {
                if (i === 1 && step === 0) {
                  setIsAppOpen(true);
                  setStep(1);
                } else handleError();
              }}
            >
              {i === 1 ? "📝" : ""}
            </div>
          ))}
        </div>
      )}

      {isAppOpen && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SimulatedWindow 
            title="Редактор - Новый документ" 
            width="520px" 
            height="420px"
            onClose={() => {
              if (step < 3) handleError();
              else setIsAppOpen(false);
            }}
          >
            <SimulatedMenu items={menuItems} />

            <div className="flex-1 flex flex-col h-[calc(100%-36px)] bg-white relative">
              <textarea
                autoFocus
                className="flex-1 p-6 outline-none resize-none font-mono text-lg text-slate-700"
                placeholder="Начните печатать здесь..."
                value={textContent}
                onChange={(e) => {
                  setTextContent(e.target.value);
                  if (step === 1 && e.target.value.toLowerCase() === 'привет мир') setStep(2);
                }}
              />

              {/* Модальное окно сохранения */}
              {step === 3 && (
                <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-80 animate-in zoom-in-95 duration-200">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">Сохранить как...</h3>
                    <input 
                      type="text"
                      autoFocus
                      className="w-full border-2 border-slate-100 p-3 rounded-xl mb-4 outline-none focus:border-blue-500 font-bold text-slate-700 transition-colors"
                      placeholder="Введите имя..."
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    />
                    <button 
                      className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        fileName === 'note.txt' 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                      onClick={() => fileName === 'note.txt' ? handleFinish() : handleError()}
                    >
                      Подтвердить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SimulatedWindow>
        </div>
      )}
    </>
  );
};