export interface Log {
  date: string; // YYYY-MM-DD
  timeSpent: number; // in minutes
}

export interface Task {
  id: string;
  name: string;
  targetTime: number; // in minutes
  logs: Log[];
  createdAt: string;
}