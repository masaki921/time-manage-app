
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Log } from '../../types';

interface TaskHistoryChartProps {
  logs: Log[];
  targetTime: number;
}

const TaskHistoryChart: React.FC<TaskHistoryChartProps> = ({ logs, targetTime }) => {
  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().slice(0, 10);
    const log = logs.find(l => l.date === dateString);
    return {
      date: d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
      '実績(分)': log ? log.timeSpent : 0,
      '目標(分)': targetTime,
    };
  }).reverse();

  return (
    <div className="h-64 w-full mt-4">
        <ResponsiveContainer>
            <BarChart
            data={data}
            margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    borderColor: '#4f46e5',
                    color: '#e2e8f0',
                    borderRadius: '0.5rem',
                }}
            />
            <Legend />
            <Bar dataKey="実績(分)" fill="#4f46e5" />
            <Bar dataKey="目標(分)" fill="#a5b4fc" opacity={0.5}/>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default TaskHistoryChart;
