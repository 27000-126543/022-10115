export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  team: string;
  level: number;
  exp: number;
  streakDays: number;
  totalScore: number;
  badges: string[];
}

export interface KnowledgeCard {
  id: string;
  title: string;
  category: '服务流程' | '预约规则' | '投诉应对' | '隐私保护' | '院内动线';
  content: string;
  keyPoints: string[];
  timeCost: number;
}

export interface DailyTask {
  id: string;
  type: 'knowledge' | 'quiz' | 'reception' | 'complaint' | 'review';
  title: string;
  description: string;
  icon: string;
  points: number;
  completed: boolean;
  timeCost: number;
}

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'judge' | 'fill';
  category: string;
  difficulty: 1 | 2 | 3;
  title: string;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  explanation: string;
  scene?: string;
}

export interface Level {
  id: string;
  name: string;
  category: string;
  icon: string;
  unlocked: boolean;
  completed: boolean;
  progress: number;
  totalQuestions: number;
  rewardPoints: number;
  position: { row: number; col: number };
}

export interface RankItem {
  id: string;
  name: string;
  avatar: string;
  team: string;
  score: number;
  rank: number;
  streakDays: number;
}

export interface TeamRank {
  id: string;
  name: string;
  score: number;
  memberCount: number;
  rank: number;
  trend: 'up' | 'down' | 'flat';
}

export interface WrongQuestion {
  id: string;
  title: string;
  category: string;
  userAnswer: string;
  correctAnswer: string;
  wrongCount: number;
  lastWrongTime: string;
}

export interface WeekFocus {
  id: string;
  title: string;
  content: string;
  publisher: string;
  publishTime: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  obtained: boolean;
  obtainedDate?: string;
  condition: string;
}

export interface ReceptionScene {
  id: string;
  title: string;
  description: string;
  steps: ReceptionStep[];
}

export interface ReceptionStep {
  id: string;
  scene: string;
  customerLine?: string;
  options: ReceptionOption[];
}

export interface ReceptionOption {
  key: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  score: number;
}

export interface ComplaintScene {
  id: string;
  type: 'bad_review' | 'reschedule' | 'no_show' | 'privacy';
  title: string;
  background: string;
  customerComplaint: string;
  options: ComplaintOption[];
}

export interface ComplaintOption {
  key: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  nextTip?: string;
}
