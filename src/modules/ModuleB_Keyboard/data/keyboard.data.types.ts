export interface KeyData {
  code: string;
  ru: string;
  en: string;
  row: number;
  finger: number;
}

export const WORD_LISTS = {
  ru: ['мама', 'рама', 'вода', 'соль', 'хлеб', 'небо', 'река', 'игра', 'утро', 'день', 'город', 'книга', 'школа', 'арбуз', 'время', 'экран', 'поезд', 'мышка', 'слово'],
  en: ['home', 'time', 'work', 'play', 'book', 'city', 'wind', 'fire', 'water', 'leaf', 'apple', 'mouse', 'space', 'light', 'world', 'train', 'plant', 'sound', 'phone']
};

export const PHRASES_LIST = {
  ru: [
    "Быстрый бурый лис прыгает через ленивого пса.",
    "Программирование — это искусство превращать кофе в код.",
    "Сегодня отличный день для изучения чего-то нового!",
    "Тише едешь — дальше будешь, если не уснёшь за рулём."
  ],
  en: [
    "The quick brown fox jumps over the lazy dog.",
    "Code is like humor. When you have to explain it, it’s bad.",
    "Talk is cheap. Show me the code.",
    "Stay hungry, stay foolish."
  ]
};

export const HOME_ROW_KEYS: KeyData[] = [
  { code: 'KeyA', ru: 'ф', en: 'a', row: 2, finger: 2 },
  { code: 'KeyS', ru: 'ы', en: 's', row: 2, finger: 3 },
  { code: 'KeyD', ru: 'в', en: 'd', row: 2, finger: 4 },
  { code: 'KeyF', ru: 'а', en: 'f', row: 2, finger: 5 },
  { code: 'KeyJ', ru: 'о', en: 'j', row: 2, finger: 6 },
  { code: 'KeyK', ru: 'л', en: 'k', row: 2, finger: 7 },
  { code: 'KeyL', ru: 'д', en: 'l', row: 2, finger: 8 },
  { code: 'Semicolon', ru: 'ж', en: ';', row: 2, finger: 9 },
];

export const KEYBOARD_ROWS = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Dot', 'Slash', 'ShiftRight'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Fn', 'Ctrl']
];

export const KEY_MAP: Record<string, {en: string, ru: string, width?: string}> = {
  'Backquote': { en: '`', ru: 'ё' },
  'Digit1': { en: '1', ru: '1' },
  'Digit2': { en: '2', ru: '2' },
  'Digit3': { en: '3', ru: '3' },
  'Digit4': { en: '4', ru: '4' },
  'Digit5': { en: '5', ru: '5' },
  'Digit6': { en: '6', ru: '6' },
  'Digit7': { en: '7', ru: '7' },
  'Digit8': { en: '8', ru: '8' },
  'Digit9': { en: '9', ru: '9' },
  'Digit0': { en: '0', ru: '0' },
  'Minus': { en: '-', ru: '-' },
  'Equal': { en: '=', ru: '=' },
  'KeyA': { en: 'a', ru: 'ф' }, 'KeyS': { en: 's', ru: 'ы' }, 'KeyD': { en: 'd', ru: 'в' }, 'KeyF': { en: 'f', ru: 'а' },
  'KeyG': { en: 'g', ru: 'п' }, 'KeyH': { en: 'h', ru: 'р' }, 'KeyJ': { en: 'j', ru: 'о' }, 'KeyK': { en: 'k', ru: 'л' },
  'KeyL': { en: 'l', ru: 'д' }, 'Semicolon': { en: ';', ru: 'ж' }, 'Quote': { en: "'", ru: 'э' },
  'KeyQ': { en: 'q', ru: 'й' }, 'KeyW': { en: 'w', ru: 'ц' }, 'KeyE': { en: 'e', ru: 'у' }, 'KeyR': { en: 'r', ru: 'к' },
  'KeyT': { en: 't', ru: 'е' }, 'KeyY': { en: 'y', ru: 'н' }, 'KeyU': { en: 'u', ru: 'г' }, 'KeyI': { en: 'i', ru: 'ш' },
  'KeyO': { en: 'o', ru: 'щ' }, 'KeyP': { en: 'p', ru: 'з' }, 'BracketLeft': { en: '[', ru: 'х' }, 'BracketRight': { en: ']', ru: 'ъ' },
  'KeyZ': { en: 'z', ru: 'я' }, 'KeyX': { en: 'x', ru: 'ч' }, 'KeyC': { en: 'c', ru: 'с' }, 'KeyV': { en: 'v', ru: 'м' },
  'KeyB': { en: 'b', ru: 'и' }, 'KeyN': { en: 'n', ru: 'т' }, 'KeyM': { en: 'm', ru: 'ь' }, 'Comma': { en: ',', ru: 'б' },
  'Dot': { en: '.', ru: 'ю' }, 'Slash': { en: '/', ru: '.' }, 'Backslash': { en: '\\', ru: '\\' },
  'Space': { en: ' ', ru: ' ', width: 'w-64' },
  'Backspace': { en: '⌫', ru: '⌫', width: 'w-20' }, 'Enter': { en: '⏎', ru: '⏎', width: 'w-24' },
  'ShiftLeft': { en: 'Shift', ru: 'Shift', width: 'w-28' }, 'ShiftRight': { en: 'Shift', ru: 'Shift', width: 'w-24' },
  'CapsLock': { en: 'Caps', ru: 'Caps', width: 'w-20' }, 'Tab': { en: 'Tab', ru: 'Tab', width: 'w-16' }
};

export const FINGER_ZONES: Record<string, number> = {
  'Backquote': 1, 'Digit1': 1, 'KeyQ': 1, 'KeyA': 1, 'KeyZ': 1,
  'Digit2': 2, 'KeyW': 2, 'KeyS': 2, 'KeyX': 2,
  'Digit3': 3, 'KeyE': 3, 'KeyD': 3, 'KeyC': 3,
  'Digit4': 4, 'Digit5': 4, 'KeyR': 4, 'KeyF': 4, 'KeyV': 4, 'KeyT': 4, 'KeyG': 4, 'KeyB': 4,
  'Space': 5,
  'Digit6': 7, 'Digit7': 7, 'KeyY': 7, 'KeyH': 7, 'KeyN': 7, 'KeyU': 7, 'KeyJ': 7, 'KeyM': 7,
  'Digit8': 8, 'KeyI': 8, 'KeyK': 8, 'Comma': 8,
  'Digit9': 9, 'KeyO': 9, 'KeyL': 9, 'Dot': 9,
  'Digit0': 10, 'Minus': 10, 'Equal': 10, 'KeyP': 10, 'Semicolon': 10, 'Quote': 10, 'Slash': 10, 'Backspace': 10, 'Enter': 10
};

export const FINGER_NAMES: Record<number, string> = {
  1: "Левый мизинец", 2: "Левый безымянный", 3: "Левый средний", 4: "Левый указательный",
  5: "Большой палец", 6: "Большой палец",
  7: "Правый указательный", 8: "Правый средний", 9: "Правый безымянный", 10: "Правый мизинец"
};

