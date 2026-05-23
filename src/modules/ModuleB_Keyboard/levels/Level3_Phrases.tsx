import React, { useState, useEffect, useCallback } from 'react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { PHRASES_LIST } from '../data/phrases';
import { KEY_MAP } from '../data/keyboard.data.types';
import type { KeyboardLevelProps } from './keyboardLevels.types';

export const Level3_Phrases: React.FC<KeyboardLevelProps> = ({
  language,
  onComplete,
  isActive
}) => {
  const [phrase, setPhrase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState({ code: '', isError: false });

  useEffect(() => {
    if (isActive) {
      const list = PHRASES_LIST[language];
      const randomPhrase = list[Math.floor(Math.random() * list.length)];
      setPhrase(randomPhrase);
      setUserInput("");
      setErrors(0);
      setStartTime(null);
    }
  }, [isActive, language]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || !phrase || userInput.length >= phrase.length) return;

    if (e.code === 'Space') e.preventDefault();

    const targetChar = phrase[userInput.length];
    const isCorrect = e.key === targetChar;

    setLastEvent({ code: e.code, isError: !isCorrect });

    if (isCorrect) {
      if (!startTime) setStartTime(Date.now());
      const newInput = userInput + e.key;
      setUserInput(newInput);

      if (newInput.length === phrase.length) {
        const endTime = Date.now();
        const timeSpent = (endTime - (startTime || endTime)) / 1000;
        const wpm = Math.round((phrase.length / 5) / (timeSpent / 60)) || 0;
        const accuracy = Math.round(((phrase.length - errors) / phrase.length) * 100);

        onComplete({
          wpm,
          accuracy: Math.max(0, accuracy),
          errors,
          totalChars: phrase.length,
          timeElapsed: timeSpent
        });
      }
    } else if (e.key.length === 1) {
      setErrors(prev => prev + 1);
    }
  }, [isActive, phrase, userInput, startTime, errors, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const nextChar = phrase[userInput.length];
  const targetKeyCode = Object.keys(KEY_MAP).find(code => {
    const val = KEY_MAP[code][language];
    return val.toLowerCase() === nextChar?.toLowerCase();
  }) || (nextChar === ' ' ? 'Space' : '');

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-5xl mx-auto">
      <div className="w-full bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-100 min-h-40 flex items-center">
        <div className="text-3xl font-mono leading-relaxed wrap-break-word w-full">
          {phrase.split('').map((char, i) => (
            <span
              key={i}
              className={`
                ${i < userInput.length ? 'text-green-500' : 'text-gray-300'}
                ${i === userInput.length ? 'bg-blue-100 text-blue-600 border-b-4 border-blue-600' : ''}
              `}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
        <div className="flex items-center gap-2">
          <span>Прогресс:</span>
          <span className="text-blue-600">{Math.round((userInput.length / phrase.length) * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Ошибки:</span>
          <span className="text-red-500">{errors}</span>
        </div>
      </div>

      <VirtualKeyboard 
        language={language}
        targetKeyCode={targetKeyCode}
        lastPressedCode={lastEvent.code}
        isError={lastEvent.isError}
      />
    </div>
  );
};