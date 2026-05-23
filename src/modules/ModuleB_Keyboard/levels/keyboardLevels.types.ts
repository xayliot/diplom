import { PHRASES_LIST } from "../data/phrases";
import { WORD_LISTS } from "../data/wordLists";
import type { KeyboardStats } from "../KeyboardTrainer.types";

export interface KeyboardLevelConfig {
  id: number;
  title: string;
  description: string;
  targetWpm: number;
  minAccuracy: number;
  content: string[];
  targetCount?: number;
}

export interface KeyboardLevelProps {
  level: KeyboardLevelConfig;
  language: 'ru' | 'en';
  isActive: boolean;
  onComplete: (stats: KeyboardStats) => void;
  onKeyHit?: (key: string) => void;
  onKeyMiss?: (expected: string, pressed: string) => void;
}

export interface KeyEventState {
  code: string;
  isError: boolean;
  timestamp: number;
}

