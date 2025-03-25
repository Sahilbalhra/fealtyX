export interface User {
  email: string;
  role: "developer" | "manager";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "pending_approval" | "closed" | "reopened";
  assignee: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  timeSpent: number; // in minutes
  lastUpdated: string;
}

export interface TimeLog {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  duration: number; // in minutes
}
