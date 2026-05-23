export interface KeyboardStats {
  wpm: number;           // Words Per Minute
  accuracy: number;      // %
  errors: number;        // Количество ошибок
  totalChars: number;    // Всего введено символов
  timeElapsed: number;   // Время в секундах
}

export interface KeyboardLevelConfig {
  id: string | number;
  title: string;
  description: string;
  targetWpm: number;     // Цель по скорости
  minAccuracy: number;   // Цель по точности
  content: string[];     // Набор букв, слов или фраз
}

export type KeyState = 'idle' | 'correct' | 'wrong' | 'active';