export interface GUIStep {
  id: string;
  instruction: string;
  targetElementId: string; // ID элемента, с которым нужно взаимодействовать
  actionType: 'click' | 'doubleClick' | 'drag' | 'type' | 'close';
  expectedValue?: string; // Для ввода текста
}

export interface GUIStats {
  timeElapsed: number;
  accuracy: number;
  errors: number;
  completedSteps: number;
}

export interface GUIScenarioProps {
  onComplete: (stats: GUIStats) => void;
  isActive: boolean;
}