export interface DiagnosticResults {
  mouse: { accuracy: number; speed: number };
  keyboard: { wpm: number; accuracy: number };
  gui: { completed: boolean; time: string };
}

export type DiagnosticStep = 'mouse' | 'keyboard' | 'gui' | 'result';

// Тип данных для этапа Мыши
export interface MouseData {
  accuracy: number;
  speed: number;
}

// Тип данных для этапа Клавиатуры
export interface KeyboardData {
  wpm: number;
  accuracy: number;
}

// Тип данных для этапа Интерфейса (GUI)
export interface GUIData {
  completed: boolean;
  time: string; // или number, если решишь считать в секундах
}

// Общий объект результатов всей диагностики
export interface DiagnosticResults {
  mouse: MouseData;
  keyboard: KeyboardData;
  gui: GUIData;
}