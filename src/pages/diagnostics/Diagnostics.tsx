import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step1_Mouse, Step2_Keyboard, Step3_GUI, Step4_Result } from './steps';
import type { DiagnosticResults, DiagnosticStep } from './Diagnostics.types';
import { useUserProgress } from '../../hooks/useUserProgress';

export const Diagnostics: React.FC = () => {
  const navigate = useNavigate();
  // Используем функцию сохранения напрямую из хука
  const { saveDiagnosticResults } = useUserProgress(); 
  
  const [currentStep, setCurrentStep] = useState<DiagnosticStep>('mouse');
  const [results, setResults] = useState<Partial<DiagnosticResults>>({});

  const handleStepComplete = (step: keyof DiagnosticResults, data: any) => {
    // Формируем актуальный набор результатов
    const updatedResults = { ...results, [step]: data };
    setResults(updatedResults);
    
    // Логика переходов
    if (step === 'mouse') {
      setCurrentStep('keyboard');
    } else if (step === 'keyboard') {
      setCurrentStep('gui');
    } else if (step === 'gui') {
      // Когда GUI завершен, вызываем сохранение из хука
      // Теперь диагностика официально считается пройденной
      saveDiagnosticResults(updatedResults); 
      setCurrentStep('result');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'mouse':
        return <Step1_Mouse onComplete={(data) => handleStepComplete('mouse', data)} />;
      case 'keyboard':
        return <Step2_Keyboard onComplete={(data) => handleStepComplete('keyboard', data)} />;
      case 'gui':
        return <Step3_GUI onComplete={(data) => handleStepComplete('gui', data)} />;
      case 'result':
        return <Step4_Result results={results as DiagnosticResults} />;
      default:
        return null;
    }
  };

  // Расчет прогресса
  const stepsOrder: DiagnosticStep[] = ['mouse', 'keyboard', 'gui', 'result'];
  const progressPercent = ((stepsOrder.indexOf(currentStep) + 1) / stepsOrder.length) * 100;

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Хедер */}
      <div className="bg-slate-900 text-white py-4 px-8 flex items-center justify-between border-b-4 border-indigo-500 z-10 shadow-xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:text-indigo-400 transition-colors font-black uppercase text-[10px] tracking-[0.2em]"
        >
          <span>← В Дашборд</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="h-2 w-64 bg-slate-700 rounded-full overflow-hidden hidden md:block">
            <div 
              className="h-full bg-indigo-500 transition-all duration-700 ease-in-out" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block leading-none mb-1">
              Первичная диагностика
            </span>
            <span className="font-black text-sm uppercase tracking-tighter block leading-none">
              Этап: {currentStep === 'result' ? 'Завершение' : currentStep.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 relative overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
};