import { createContext, useContext, useState, ReactNode } from 'react';
import type { UserInfo, DailyTask } from '@/types';
import { currentUser } from '@/data/rank';
import { dailyTasks as initialTasks } from '@/data/tasks';

interface AppState {
  user: UserInfo;
  tasks: DailyTask[];
  completedTasks: string[];
  totalScore: number;
  completeTask: (taskId: string, points: number) => void;
  addScore: (points: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo>(currentUser);
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>(
    initialTasks.filter(t => t.completed).map(t => t.id)
  );
  const [totalScore, setTotalScore] = useState<number>(currentUser.totalScore);

  const completeTask = (taskId: string, points: number) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, completed: true } : t
    ));
    setCompletedTasks(prev => [...prev, taskId]);
    addScore(points);
  };

  const addScore = (points: number) => {
    setTotalScore(prev => prev + points);
    setUser(prev => ({
      ...prev,
      totalScore: prev.totalScore + points,
      exp: prev.exp + points
    }));
  };

  return (
    <AppContext.Provider value={{ user, tasks, completedTasks, totalScore, completeTask, addScore }}>
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
