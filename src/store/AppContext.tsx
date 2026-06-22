import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import type { UserInfo, DailyTask } from '@/types';
import { currentUser as initialUser } from '@/data/rank';
import { dailyTasks as initialTasks } from '@/data/tasks';
import { levels } from '@/data/levels';
import { getToday } from '@/utils';

const STORAGE_KEY = 'medi_train_state_v1';

export interface LevelProgress {
  answeredIds: string[];
  correctCount: number;
  completed: boolean;
}

interface PersistedState {
  user: UserInfo;
  completedTasks: string[];
  tasksDate: string | null;
  lastCheckInDate: string | null;
  lastActiveDate: string | null;
  levelProgress: Record<string, LevelProgress>;
  categoryCounts: Record<string, number>;
  wrongQuestionIds: string[];
}

interface AppState {
  user: UserInfo;
  tasks: DailyTask[];
  completedTasks: string[];
  totalScore: number;
  checkedIn: boolean;
  levelProgress: Record<string, LevelProgress>;
  categoryCounts: Record<string, number>;
  wrongQuestionIds: string[];
  completeTask: (taskId: string, points: number) => void;
  completeTaskByType: (type: DailyTask['type'], points?: number) => void;
  addScore: (points: number) => void;
  checkIn: () => number;
  recordAnswer: (params: {
    levelId?: string;
    questionId: string;
    category: string;
    isCorrect: boolean;
    questionScore?: number;
  }) => { levelCompleted?: boolean; taskCompleted?: boolean };
  getLevelProgress: (levelId: string) => LevelProgress;
  getCategoryCount: (category: string) => number;
  resetWrongQuestions: () => void;
}

const AppContext = createContext<AppState | null>(null);

function loadPersistedState(): PersistedState | null {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as PersistedState;
    }
  } catch (e) {
    console.error('[AppContext] 读取本地存储失败', e);
  }
  return null;
}

function savePersistedState(state: PersistedState) {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[AppContext] 保存本地存储失败', e);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const today = getToday();
  const persisted = loadPersistedState();

  const [user, setUser] = useState<UserInfo>(() => {
    if (persisted?.user) return persisted.user;
    return initialUser;
  });

  const isSameDay = persisted?.tasksDate === today;

  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    if (isSameDay && persisted?.completedTasks?.length) {
      return persisted.completedTasks;
    }
    return initialTasks.filter(t => t.completed).map(t => t.id);
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const completed = isSameDay ? (persisted?.completedTasks || []) : [];
    return initialTasks.map(t => ({
      ...t,
      completed: (!isSameDay ? t.completed : false) || completed.includes(t.id)
    }));
  });

  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(() => {
    return persisted?.lastCheckInDate || null;
  });

  const [levelProgress, setLevelProgress] = useState<Record<string, LevelProgress>>(() => {
    return persisted?.levelProgress || {};
  });

  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(() => {
    if (isSameDay && persisted?.categoryCounts) return persisted.categoryCounts;
    return {};
  });

  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>(() => {
    return persisted?.wrongQuestionIds || [];
  });

  const checkedIn = lastCheckInDate === today;
  const totalScore = user.totalScore;

  const TASK_QUOTA: Partial<Record<DailyTask['type'], { category: string; count: number }>> = {
    quiz: { category: '预约规则', count: 5 },
    review: { category: '__wrong__', count: 3 }
  };

  useEffect(() => {
    const state: PersistedState = {
      user,
      completedTasks,
      tasksDate: today,
      lastCheckInDate,
      lastActiveDate: today,
      levelProgress,
      categoryCounts,
      wrongQuestionIds
    };
    savePersistedState(state);
  }, [user, completedTasks, lastCheckInDate, levelProgress, categoryCounts, wrongQuestionIds]);

  const addScore = (points: number) => {
    setUser(prev => ({
      ...prev,
      totalScore: prev.totalScore + points,
      exp: prev.exp + points
    }));
  };

  const completeTask = (taskId: string, points: number) => {
    if (completedTasks.includes(taskId)) return;
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, completed: true } : t
    ));
    setCompletedTasks(prev => [...prev, taskId]);
    addScore(points);
  };

  const completeTaskByType = (type: DailyTask['type'], pointsOverride?: number) => {
    const task = tasks.find(t => t.type === type && !t.completed);
    if (task) {
      completeTask(task.id, pointsOverride ?? task.points);
    }
  };

  const checkIn = (): number => {
    if (checkedIn) return 0;
    setLastCheckInDate(today);
    const points = 10;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getToday(yesterday);
    const checkedInYesterday = lastCheckInDate === yesterdayStr;

    setUser(prev => ({
      ...prev,
      totalScore: prev.totalScore + points,
      exp: prev.exp + points,
      streakDays: checkedInYesterday ? prev.streakDays + 1 : 1
    }));
    return points;
  };

  const getLevelProgress = (levelId: string): LevelProgress => {
    return (
      levelProgress[levelId] || {
        answeredIds: [],
        correctCount: 0,
        completed: false
      }
    );
  };

  const getCategoryCount = (category: string): number => {
    if (category === '__wrong__') {
      return categoryCounts['__wrong__'] || 0;
    }
    return categoryCounts[category] || 0;
  };

  const resetWrongQuestions = () => {
    setWrongQuestionIds([]);
    setCategoryCounts(prev => ({ ...prev, __wrong__: 0 }));
  };

  const recordAnswer: AppState['recordAnswer'] = ({
    levelId,
    questionId,
    category,
    isCorrect,
    questionScore = 10
  }) => {
    const result: { levelCompleted?: boolean; taskCompleted?: boolean } = {};

    if (!isCorrect) {
      setWrongQuestionIds(prev =>
        prev.includes(questionId) ? prev : [...prev, questionId]
      );
    }

    setCategoryCounts(prev => {
      const next = { ...prev };
      next[category] = (next[category] || 0) + 1;
      (Object.keys(TASK_QUOTA) as (keyof typeof TASK_QUOTA)[]).forEach(taskType => {
        const quota = TASK_QUOTA[taskType];
        if (!quota) return;
        if (category !== quota.category) return;
        const newCount = next[category];
        if (newCount >= quota.count) {
          const task = tasks.find(t => t.type === taskType && !t.completed);
          if (task) {
            setTasks(pt => pt.map(t => t.id === task.id ? { ...t, completed: true } : t));
            setCompletedTasks(pct => pct.includes(task.id) ? pct : [...pct, task.id]);
            setUser(pu => ({
              ...pu,
              totalScore: pu.totalScore + task.points,
              exp: pu.exp + task.points
            }));
            result.taskCompleted = true;
          }
        }
      });
      return next;
    });

    if (isCorrect && questionScore > 0) {
      addScore(questionScore);
    }

    if (levelId) {
      let levelCompleted = false;
      setLevelProgress(prev => {
        const cur: LevelProgress = prev[levelId] || { answeredIds: [], correctCount: 0, completed: false };
        if (cur.answeredIds.includes(questionId)) return prev;
        const next: LevelProgress = {
          answeredIds: [...cur.answeredIds, questionId],
          correctCount: cur.correctCount + (isCorrect ? 1 : 0),
          completed: cur.completed
        };
        const level = levels.find(l => l.id === levelId);
        if (level && next.answeredIds.length >= level.totalQuestions) {
          next.completed = true;
          levelCompleted = true;
        }
        return { ...prev, [levelId]: next };
      });
      if (levelCompleted) {
        result.levelCompleted = true;
      }
    }

    return result;
  };

  return (
    <AppContext.Provider value={{
      user,
      tasks,
      completedTasks,
      totalScore,
      checkedIn,
      levelProgress,
      categoryCounts,
      wrongQuestionIds,
      completeTask,
      completeTaskByType,
      addScore,
      checkIn,
      recordAnswer,
      getLevelProgress,
      getCategoryCount,
      resetWrongQuestions
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
