import { randomUUID } from 'crypto';

export type Course = {
  id: string;
  userId: string;
  name: string;
  code?: string;
  instructor?: string;
  term?: string;
  createdAt: string;
  updatedAt: string;
  deadlines: Deadline[];
};

export type Deadline = {
  id: string;
  title: string;
  type: 'exam' | 'assignment' | 'milestone';
  dueDate: string; // ISO
};

export type Material = {
  id: string;
  userId: string;
  courseId: string;
  title: string;
  kind: 'pdf' | 'text' | 'voice';
  sourceRef?: string;
  chunks: Chunk[];
  createdAt: string;
};

export type Chunk = {
  id: string;
  courseId: string;
  materialId: string;
  text: string;
  sourceRef?: string;
  importance?: number;
};

export type QuizQuestion = {
  id: string;
  courseId: string;
  prompt: string;
  answer: string;
  sourceChunkId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  format: 'flashcard' | 'short-answer';
};

export type QuizSession = {
  id: string;
  courseId: string;
  createdAt: string;
  questions: QuizQuestion[];
  responses: QuizResponse[];
};

export type QuizResponse = {
  questionId: string;
  correct: boolean;
  latencyMs?: number;
};

export type MasteryRecord = {
  courseId: string;
  concept: string;
  strength: number; // 0..1
  lastReviewed?: string;
};

export type StudyTask = {
  id: string;
  topic: string;
  format: 'quiz' | 'recap' | 'review';
  durationMinutes: number;
  notes?: string;
};

export type StudyPlan = {
  id: string;
  courseId: string;
  generatedAt: string;
  targetMinutes: number;
  tasks: StudyTask[];
};

export const nowIso = () => new Date().toISOString();
export const uid = () => randomUUID();
