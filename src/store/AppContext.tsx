import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import type { UserInfo, DailyTask } from '@/types';
import { currentUser as initialUser } from '@/data/rank';
import { dailyTasks as initialTasks } from '@/data/tasks';
import { getToday } from '@/utils';

const STORAGE_KEY = 'medi_train_state_v1';

interface PersistedState {
  user: UserInfo;
  completedTasks: string[];
  checkedInDate: string | null;
  lastActiveDate: string | null;
}

interface AppState {
  user: UserInfo;
  tasks: DailyTask[];
  completedTasks: string[];
  totalScore: number;
  checkedIn: boolean;
  completeTask: (taskId: string, points: number) => void;
  completeTaskByType: (type: DailyTask['type'], points?: number) => void;
  addScore: (points: number) => void;
  checkIn: () => number;
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

  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    if (persisted?.completedTasks?.length) {
      return persisted.completedTasks;
    }
    return initialTasks.filter(t => t.completed).map(t => t.id);
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const completed = persisted?.completedTasks || [];
    return initialTasks.map(t => ({
      ...t,
      completed: t.completed || completed.includes(t.id)
    }));
  });

  const [checkedIn, setCheckedIn] = useState<boolean>(() => {
    return persisted?.checkedInDate === today;
  });

  const totalScore = user.totalScore;

  useEffect(() => {
    const state: PersistedState = {
      user,
      completedTasks,
      checkedInDate: checkedIn ? today : null,
      lastActiveDate: today
    };
    savePersistedState(state);
  }, [user, completedTasks, checkedIn]);

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
    setCheckedIn(true);
    const points = 10;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getToday(yesterday);
    const wasActiveYesterday = persisted?.lastActiveDate === yesterdayStr || persisted?.checkedInDate === yesterdayStr;

    setUser(prev => ({
      ...prev,
      totalScore: prev.totalScore + points,
      exp: prev.exp + points,
      streakDays: wasActiveYesterday ? prev.streakDays + 1 : 1
    }));
    return points;
  };

  return (
    <AppContext.Provider value={{
      user,
      tasks,
      completedTasks,
      totalScore,
      checkedIn,
      completeTask,
      completeTaskByType,
      addScore,
      checkIn
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
