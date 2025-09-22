import React from 'react';

interface MotivationalMessageProps {
  message: string | null;
  isLoading: boolean;
}

const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ message, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-blue-100 dark:bg-slate-700 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded-b-lg animate-pulse">
        <div className="flex items-center">
            <div className="text-xl mr-3">🧠</div>
            <div>AIコーチが応援メッセージを考えています...</div>
        </div>
      </div>
    );
  }

  if (!message) {
    return null;
  }

  return (
    <div className="bg-green-100 dark:bg-slate-700 border-l-4 border-green-500 text-green-800 dark:text-green-300 p-4 rounded-b-lg">
      <div className="flex items-center">
        <div className="text-xl mr-3">🎉</div>
        <div>
            <p className="font-bold">AIコーチからのメッセージ</p>
            <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MotivationalMessage;