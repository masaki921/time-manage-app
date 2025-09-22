import React, { useState } from 'react';
// FIX: Add .ts extension to the import path to ensure correct module resolution.
import type { Task } from '../types.ts';
import PlusIcon from './icons/PlusIcon';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'logs' | 'createdAt'>) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [name, setName] = useState('');
  const [targetTime, setTargetTime] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || targetTime <= 0) {
      alert('タスク名と目標時間を正しく入力してください。');
      return;
    }
    onAddTask({ name, targetTime });
    setName('');
    setTargetTime(60);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">新しい目標を追加</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-1/2">
          <label htmlFor="task-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">目標</label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：プログラミングの学習"
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <label htmlFor="target-time" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">毎日の目標時間 (分)</label>
          <input
            id="target-time"
            type="number"
            value={targetTime}
            onChange={(e) => setTargetTime(parseInt(e.target.value, 10))}
            min="1"
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <div className="w-full sm:w-auto pt-0 sm:pt-6">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>追加</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;