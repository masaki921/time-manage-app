
import { GoogleGenAI } from "@google/genai";
import type { Task } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getMotivationalMessage = async (task: Task, timeSpentToday: number, streak: number): Promise<string> => {
  const goalMet = timeSpentToday >= task.targetTime;
  
  const prompt = `あなたは、ポジティブで、ユーザーを元気づける生産性向上コーチです。ユーザーはタスクの時間管理をしています。
タスク名: 「${task.name}」
毎日の目標時間: ${task.targetTime}分
今日取り組んだ時間: ${timeSpentToday}分
現在の継続日数: ${streak}日

上記の情報に基づいて、ユーザーのための短く（2〜3文）、やる気を引き出すポジティブなメッセージを生成してください。
- 目標を達成した場合、その成功を祝福してください。
- 目標を達成できなかった場合、批判的にならず、優しく励ましてください。明日への希望を持たせるような言葉をかけてください。
- 日本語で回答してください。`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating motivational message:", error);
    return "素晴らしい！今日も一歩前進しましたね。明日も頑張りましょう！";
  }
};
