import React, { useState, useCallback } from 'react';
import type { Task } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import AddTaskForm from './components/AddTaskForm';
import TaskCard from './components/TaskCard';
import LogTimeModal from './components/LogTimeModal';
import { getMotivationalMessage } from './services/geminiService';
import TrophyIcon from './components/icons/TrophyIcon';

const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivationalMessages, setMotivationalMessages] = useState<Record<string, string | null>>({});
  const [loadingMessages, setLoadingMessages] = useState<Record<string, boolean>>({});

  const handleAddTask = useCallback((taskData: Omit<Task, 'id' | 'logs' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      logs: [],
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [setTasks]);

  const handleDeleteTask = (taskId: string) => {
    if(window.confirm("本当にこのタスクを削除しますか？")){
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  }

  const handleLogTime = useCallback(async (taskId: string, timeSpent: number) => {
    const today = new Date().toISOString().slice(0, 10);
    let updatedTask: Task | undefined;

    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const otherLogs = task.logs.filter(log => log.date !== today);
          const newLogs = timeSpent > 0 ? [...otherLogs, { date: today, timeSpent }] : otherLogs;
          updatedTask = { ...task, logs: newLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())};
          return updatedTask;
        }
        return task;
      })
    );

    if (updatedTask) {
        setLoadingMessages(prev => ({ ...prev, [taskId]: true }));
        setMotivationalMessages(prev => ({...prev, [taskId]: null}));
      try {
        const sortedLogs = [...updatedTask.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        let streak = 0;
        let lastDate = new Date();

        if (sortedLogs.length > 0 && sortedLogs[0].date !== today) {
            lastDate.setDate(lastDate.getDate() - 1);
        }

        for (const log of sortedLogs) {
            const logDate = new Date(log.date + 'T00:00:00');
            const diff = (lastDate.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
            if (diff <= 1 && log.timeSpent >= updatedTask.targetTime) {
                streak++;
                lastDate = logDate;
            } else {
                break;
            }
        }
        
        const message = await getMotivationalMessage(updatedTask, timeSpent, streak);
        setMotivationalMessages(prev => ({ ...prev, [taskId]: message }));
      } catch (error) {
        console.error("Failed to get motivational message", error);
      } finally {
        setLoadingMessages(prev => ({ ...prev, [taskId]: false }));
      }
    }
  }, [setTasks]);

  const handleOpenLogModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            目標達成ダッシュボード
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">毎日の進捗を記録して、夢を現実に。</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddTaskForm onAddTask={handleAddTask} />
        
        {tasks.length === 0 ? (
            <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl shadow-lg">
                <TrophyIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-700 dark:text-slate-200">まだ目標がありません</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">最初の一歩を踏み出して、新しい目標を追加しましょう！</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tasks.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(task => (
                <TaskCard
                key={task.id}
                task={task}
                onOpenLogModal={handleOpenLogModal}
                motivationalMessage={motivationalMessages[task.id]}
                isMotivationLoading={loadingMessages[task.id] || false}
                onDeleteTask={handleDeleteTask}
                />
            ))}
            </div>
        )}
      </main>

      {selectedTask && (
        <LogTimeModal
          isOpen={isModalOpen}
          task={selectedTask}
          onLogTime={handleLogTime}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;