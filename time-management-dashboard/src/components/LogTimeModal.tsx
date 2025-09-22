import React, { useState, useEffect } from 'react';
import type { Task } from '../types.ts';

interface LogTimeModalProps {
  task: Task;
  onLogTime: (taskId: string, timeSpent: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

const LogTimeModal: React.FC<LogTimeModalProps> = ({ task, onLogTime, onClose, isOpen }) => {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (isOpen) {
        const today = new Date().toISOString().slice(0, 10);
        const todaysLog = task.logs.find(log => log.date === today);
        setTimeSpent(todaysLog?.timeSpent || 0);
    }
  }, [isOpen, task]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(timeSpent < 0) {
        alert("時間は0分以上で入力してください。");
        return;
    }
    onLogTime(task.id, timeSpent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">今日の活動時間を記録</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">「{task.name}」にどれくらい取り組みましたか？</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="time-spent" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">今日の活動時間 (分)</label>
            <input
              id="time-spent"
              type="number"
              value={timeSpent}
              onChange={(e) => setTimeSpent(parseInt(e.target.value, 10) || 0)}
              min="0"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              記録する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogTimeModal;