import { create } from "zustand";
import { User, Task, TimeLog } from "./types";

interface Store {
  user: User | null;
  tasks: Task[];
  timeLogs: TimeLog[];
  setUser: (user: User | null) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addTimeLog: (timeLog: TimeLog) => void;
  updateTimeLog: (timeLog: TimeLog) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  tasks: [],
  timeLogs: [],
  setUser: (user) => set({ user }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
  addTimeLog: (timeLog) =>
    set((state) => ({ timeLogs: [...state.timeLogs, timeLog] })),
  updateTimeLog: (timeLog) =>
    set((state) => ({
      timeLogs: state.timeLogs.map((t) => (t.id === timeLog.id ? timeLog : t)),
    })),
}));
