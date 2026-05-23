import React, { useState, useEffect, useCallback } from 'react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { KEY_MAP } from '../data/keyboard.data.types';
import type { KeyboardLevelProps } from './keyboardLevels.types';

export const Level2_SimpleWords: React.FC<KeyboardLevelProps> = ({
  level,
  language,
  onComplete,
  isActive
}) => {
  const [sessionWords, setSessionWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState({ code: '', isError: false });

  useEffect(() => {
    if (isActive && level.content && Array.isArray(level.content)) {
      const allWords = level.content as string[];
      const limit = level.targetCount || 10;
      
      const selected = [...allWords]
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
      
      setSessionWords(selected);
      setCurrentWordIndex(0);
      setCurrentInput("");
      setErrors(0);
      setStartTime(null);
    }
  }, [isActive, level.id, language, level.targetCount]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || sessionWords.length === 0 || currentWordIndex >= sessionWords.length) return;

    const targetWord = sessionWords[currentWordIndex];
    const targetChar = targetWord[currentInput.length];
    
    if (!startTime) setStartTime(Date.now());

    if (e.key === targetChar) {
      const newInput = currentInput + e.key;
      setLastEvent({ code: e.code, isError: false });
      
      if (newInput === targetWord) {
        if (currentWordIndex === sessionWords.length - 1) {
          const endTime = Date.now();
          const timeSpent = (endTime - (startTime || endTime)) / 1000;
          
          const totalChars = sessionWords.join(' ').length;
          const wpm = Math.round((totalChars / 5) / (timeSpent / 60)) || 0;
          const accuracy = Math.round(((totalChars - errors) / totalChars) * 100);

          onComplete({
            wpm,
            accuracy: Math.max(0, accuracy),
            errors,
            totalChars,
            timeElapsed: timeSpent
          });
        } else {
          setCurrentWordIndex(prev => prev + 1);
          setCurrentInput("");
        }
      } else {
        setCurrentInput(newInput);
      }
    } else if (e.key.length === 1) {
      setErrors(prev => prev + 1);
      setLastEvent({ code: e.code, isError: true });
    }
  }, [isActive, sessionWords, currentWordIndex, currentInput, startTime, errors, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const nextChar = sessionWords[currentWordIndex]?.[currentInput.length];
  const targetKeyCode = Object.keys(KEY_MAP).find(
    code => KEY_MAP[code][language].toLowerCase() === nextChar?.toLowerCase()
  );

  if (sessionWords.length === 0) {
    return <div className="p-10 text-gray-400 text-center font-bold">Подготовка слов...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 h-full max-h-[85vh] justify-between">
      <div className="w-full max-w-2xl bg-white p-3 rounded-xl shadow-sm flex justify-between items-center border border-gray-100 h-16">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Слово</span>
          <span className="text-lg font-black text-blue-600 leading-none">{currentWordIndex + 1} / {sessionWords.length}</span>
        </div>
        <div className="h-1.5 flex-1 mx-6 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${((currentWordIndex + 1) / sessionWords.length) * 100}%` }}
          />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Ошибки</span>
          <span className="text-lg font-black text-red-500 leading-none">{errors}</span>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="text-4xl sm:text-5xl font-mono tracking-[0.2em] flex bg-white px-10 py-6 rounded-2xl shadow-lg border-b-4 border-gray-200 min-w-80 justify-center">
          {sessionWords[currentWordIndex]?.split('').map((char, i) => (
            <span 
              key={i}
              className={`transition-colors duration-100
                ${i < currentInput.length ? 'text-green-500 opacity-40' : 'text-gray-200'}
                ${i === currentInput.length ? 'border-b-4 border-blue-500 animate-pulse text-gray-800' : ''}
              `}
            >
              {char}
            </span>
          ))}
        </div>
        
        <div className="mt-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider opacity-60">
          {sessionWords[currentWordIndex + 1] ? (
            <span>Далее: <span className="text-gray-600">{sessionWords[currentWordIndex + 1]}</span></span>
          ) : 'Последнее слово!'}
        </div>
      </div>

      <div className="w-full flex justify-center transform scale-90 sm:scale-95 lg:scale-100 origin-bottom transition-transform">
        <VirtualKeyboard 
          language={language}
          targetKeyCode={targetKeyCode}
          lastPressedCode={lastEvent.code}
          isError={lastEvent.isError}
        />
      </div>
    </div>
  );
};