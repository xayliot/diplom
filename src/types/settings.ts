export interface UserSettings {
  mouseSpeed: number;        // 1-10
  cursorSize: 'small' | 'medium' | 'large';
  fontSize: 'normal' | 'large' | 'extra-large';
  soundEnabled: boolean;
  soundVolume: number;       // 0-100
  highContrast: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  language: 'ru' | 'en';
}