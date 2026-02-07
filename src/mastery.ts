import { loadState, saveState } from './storage';
import { MasteryRecord, QuizResponse } from './types';

export function getMastery(courseId: string): MasteryRecord[] {
  const state = loadState();
  return state.mastery.filter((m) => m.courseId === courseId);
}

export function recordQuizResults(courseId: string, concept: string, responses: QuizResponse[]): MasteryRecord {
  const state = loadState();
  const correctCount = responses.filter((r) => r.correct).length;
  const strengthDelta = responses.length ? correctCount / responses.length : 0;
  const existing = state.mastery.find((m) => m.courseId === courseId && m.concept === concept);

  if (existing) {
    existing.strength = clamp(existing.strength * 0.7 + strengthDelta * 0.3, 0, 1);
    existing.lastReviewed = new Date().toISOString();
    saveState(state);
    return existing;
  }

  const record: MasteryRecord = {
    courseId,
    concept,
    strength: clamp(strengthDelta, 0, 1),
    lastReviewed: new Date().toISOString(),
  };
  state.mastery.push(record);
  saveState(state);
  return record;
}

export function weakestTopics(courseId: string, limit = 3): MasteryRecord[] {
  return getMastery(courseId)
    .sort((a, b) => a.strength - b.strength)
    .slice(0, limit);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
