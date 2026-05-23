import React, { useState, useEffect, useCallback } from 'react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { KEY_MAP } from '../data/keyboard.data.types';
import type { KeyboardLevelProps } from './keyboardLevels.types';

export const Level1_Orientation: React.FC<KeyboardLevelProps> = ({
  level,
  language,
  onComplete,
  isActive
}) => {
  const [exerciseText, setExerciseText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [lastEvent, setLastEvent] = useState({ code: '', isError: false });
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isActive) {
      const chars = level.content; 
      let text = "";
      for (let i = 0; i < 20; i++) {
        text += chars[Math.floor(Math.random() * chars.length)];
      }
      setExerciseText(text);
      setCurrentIndex(0);
      setErrors(0);
      setStartTime(null);
    }
  }, [isActive, level.content]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || currentIndex >= exerciseText.length) return;

    if (e.code === 'Space') e.preventDefault();

    const pressedKey = e.key.toLowerCase();
    const targetChar = exerciseText[currentIndex].toLowerCase();
    const isCorrect = pressedKey === targetChar;

    setLastEvent({ code: e.code, isError: !isCorrect });

    if (isCorrect) {
      if (!startTime) setStartTime(Date.now());
      
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex === exerciseText.length) {
        const endTime = Date.now();
        const timeSpent = (endTime - (startTime || endTime)) / 1000;
        const wpm = Math.round((exerciseText.length / 5) / (timeSpent / 60)) || 0;
        const accuracy = Math.round(((exerciseText.length - errors) / exerciseText.length) * 100);

        onComplete({
          wpm,
          accuracy: Math.max(0, accuracy),
          errors,
          totalChars: exerciseText.length,
          timeElapsed: timeSpent
        });
      }
    } else {
      if (e.key.length === 1) {
        setErrors(prev => prev + 1);
      }
    }
  }, [isActive, currentIndex, exerciseText, startTime, errors, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentTargetCode = Object.keys(KEY_MAP).find(
    code => KEY_MAP[code][language].toLowerCase() === exerciseText[currentIndex]?.toLowerCase()
  );

  return (
    <div className="flex flex-col items-center gap-6 p-6">

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.2em]">Нажимайте клавиши</h2>
        <div className="text-5xl font-mono bg-white px-12 py-10 rounded-4xl shadow-2xl border-b-8 border-gray-200 flex gap-2">
          {exerciseText.split('').map((char, i) => (
            <span
              key={i}
              className={`transition-all duration-150 ${
                i < currentIndex ? 'text-green-500 opacity-30' : 
                i === currentIndex ? 'text-blue-600 scale-125 underline decoration-4 underline-offset-8' : 
                'text-gray-300'
              }`}
            >
              {char}
            </span>
          ))}
        </div>
                    <div className="flex gap-8 mt-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Прогресс</span>
          <span className="text-lg font-black">{currentIndex} / {exerciseText.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Ошибки</span>
          <span className="text-lg font-black text-red-500">{errors}</span>
        </div>
      </div>
      </div>

      <VirtualKeyboard 
        language={language}
        targetKeyCode={currentTargetCode}
        lastPressedCode={lastEvent.code}
        isError={lastEvent.isError}
      />
      

    </div>
  );
};