import type { MouseLevel } from '../modules/ModuleA_Mouse/MouseTrainer.types';
import  { PHRASES_LIST } from '../modules/ModuleB_Keyboard/data/phrases';
import  { WORD_LISTS } from '../modules/ModuleB_Keyboard/data/wordLists';

export const mouseLevels: MouseLevel[] = [
  {
    id: 'level1-tracking',
    title: 'Учимся следить',
    description: 'Ведите курсор по пунктирной линии за зелёной точкой',
    difficulty: 1,
    targetCount: 1,
    targetSize: 30,
    requiredAccuracy: 10,
    showTrajectory: true
  },
  {
    id: 'level2-click-static',
    title: 'Точные попадания',
    description: 'Нажимайте на появляющиеся цели. Начните с зелёной!',
    difficulty: 1,
    targetCount: 5,
    targetSize: 40,
    requiredAccuracy: 80
  },
  {
    id: 'level3-click-dynamic',
    title: 'Ловкие движения',
    description: 'Цели движутся, но вы справитесь!',
    difficulty: 2,
    targetCount: 5,
    targetSize: 35,
    requiredAccuracy: 75,
    isMoving: true
  },
  {
    id: 'level4-drag-drop',
    title: 'Перетаскивание',
    description: 'Схватите шарик и перетащите в корзинку',
    difficulty: 2,
    targetCount: 3,
    targetSize: 30,
    requiredAccuracy: 85
  }
];

export const KEYBOARD_LEVELS = [
  { 
    id: 1, 
    difficulty: 1, 
    title: 'Ориентация', 
    description: 'Базовый ряд: ФЫВА - ОЛДЖ. Основа слепого метода.',
    targetWpm: 20, 
    minAccuracy: 90, 
    content: [
    'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
    'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
    'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'ё',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    '.', '-'
    ]
  },
  { 
    id: 2, 
    difficulty: 2, 
    title: 'Простые слова', 
    description: 'Тренировка на коротких и частотных словах для закрепления навыка.',
    targetWpm: 40, 
    minAccuracy: 70, 
    content: WORD_LISTS.ru 
  },
  { 
    id: 3, 
    difficulty: 3, 
    title: 'Фразы', 
    description: 'Короткие предложения с пробелами и простыми знаками препинания.',
    targetWpm: 50, 
    minAccuracy: 60, 
    content: PHRASES_LIST.ru 
  },
  { 
    id: 4, 
    difficulty: 4, 
    title: 'Слепой метод', 
    description: 'Сложные тексты для отработки полноценной десятипальцевой печати.',
    targetWpm: 60, 
    minAccuracy: 70, 
    content: [...PHRASES_LIST.ru, ...WORD_LISTS.ru] 
  },
];

export interface GUILevel {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetCount?: number;
}

export const GUI_LEVELS: GUILevel[] = [
  {
    id: 'g1',
    title: 'Работа с файлами',
    description: 'Научитесь сохранять документы через главное меню приложения.',
    icon: '📂'
  },
  {
    id: 'g2',
    title: 'Управление окнами',
    description: 'Освойте кнопки свертывания, развертывания и закрытия окон.',
    icon: '🪟'
  },
  {
    id: 'g3',
    title: 'Поиск в браузере',
    description: 'Имитация работы в веб-браузере: ввод адреса и поиск информации.',
    icon: '🌐'
  }
];