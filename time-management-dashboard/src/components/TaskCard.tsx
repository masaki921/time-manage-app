import React, { useMemo } from 'react';
import type { Task } from '../types.ts';
import ClockIcon from './icons/ClockIcon.tsx';
import TrophyIcon from './icons/TrophyIcon.tsx';
import FireIcon from './icons/FireIcon.tsx';
import TaskHistoryChart from './charts/TaskHistoryChart.tsx';
import MotivationalMessage from './MotivationalMessage.tsx';

interface TaskCardProps {
  task: Task;
  onOpenLogModal: (task: Task) => void;
  motivationalMessage: string | null;
  isMotivationLoading: boolean;
  onDeleteTask: (taskId: string) => void;
}

const formatTime = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}時間${m > 0 ? ` ${m}分` : ''}`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onOpenLogModal, motivationalMessage, isMotivationLoading, onDeleteTask }) => {

  const { timeSpentToday, totalTime, streak, goalMetToday } = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    
    const timeSpentToday = task.logs.find(log => log.date === todayStr)?.timeSpent || 0;
    const totalTime = task.logs.reduce((sum, log) => sum + log.timeSpent, 0);

    let currentStreak = 0;
    const sortedLogs = [...task.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let lastDate = today;

    if(sortedLogs.length > 0 && sortedLogs[0].date !== todayStr) {
        lastDate.setDate(lastDate.getDate() - 1);
    }

    for (const log of sortedLogs) {
        const logDate = new Date(log.date + 'T00:00:00');
        const diff = (lastDate.getTime() - logDate.getTime()) / (1000 * 3600 * 24);

        if (diff <= 1 && log.timeSpent >= task.targetTime) {
            currentStreak++;
            lastDate = logDate;
        } else {
            break;
        }
    }

    const goalMetToday = timeSpentToday >= task.targetTime;

    return { timeSpentToday, totalTime, streak: currentStreak, goalMetToday };
  }, [task]);

  const progress = Math.min((timeSpentToday / task.targetTime) * 100, 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{task.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">毎日の目標: {formatTime(task.targetTime)}</p>
            </div>
            <button onClick={() => onDeleteTask(task.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <i className="fas fa-trash-alt"></i>
            </button>
        </div>
        
        <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">今日の進捗</span>
                <span className={`text-sm font-medium ${goalMetToday ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {formatTime(timeSpentToday)} / {formatTime(task.targetTime)}
                </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
                className={`h-2.5 rounded-full transition-all duration-500 ${goalMetToday ? 'bg-green-500' : 'bg-indigo-600'}`}
                style={{ width: `${progress}%` }}
            ></div>
            </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                <FireIcon className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                <p className="font-bold text-xl">{streak}日</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">継続日数</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                <TrophyIcon className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
                <p className="font-bold text-xl">{formatTime(totalTime)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">累計時間</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                 <p className="font-bold text-xl">{goalMetToday ? '達成' : '挑戦中'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">今日の目標</p>
            </div>
        </div>
        
        <TaskHistoryChart logs={task.logs} targetTime={task.targetTime} />
        
        <div className="mt-6">
          <button
            onClick={() => onOpenLogModal(task)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            <ClockIcon className="w-5 h-5" />
            <span>今日の活動を記録する</span>
          </button>
        </div>
      </div>
      {(motivationalMessage || isMotivationLoading) && (
        <MotivationalMessage message={motivationalMessage} isLoading={isMotivationLoading} />
      )}
    </div>
  );
};

export default TaskCard;