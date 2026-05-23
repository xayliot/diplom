export interface StatCardProps {
  type: 'accuracy' | 'speed' | 'sessionTime' | 'score';
  value: number | string;
  trend?: number; // Положительное или отрицательное число для отображения динамики
}

export interface AchievementItem {
  id: string;
  title: string;
  icon: string;
  date: string;
  description: string;
}