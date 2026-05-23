export interface SkillStats {
  level: number;
  xp: number;
  accuracy: number;
  status: 'beginner' | 'intermediate' | 'advanced' | 'pro';
}

export interface UserDashboardData {
  userName: string;
  overallProgress: number; // 0-100
  skills: {
    mouse: SkillStats;
    keyboard: SkillStats;
    gui: SkillStats;
  };
  recentAchievements: Array<{ id: string; title: string; icon: string; date: string }>;
}