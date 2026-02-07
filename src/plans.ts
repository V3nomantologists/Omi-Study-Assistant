import { loadState } from './storage';
import { StudyPlan, StudyTask, nowIso, uid } from './types';
import { weakestTopics } from './mastery';

export type PlanInput = {
  userId: string;
  courseId: string;
  minutes: number;
};

export function recommendStudyPlan(input: PlanInput): StudyPlan | { error: string } {
  const state = loadState();
  const courseMaterials = state.materials.filter((m) => m.userId === input.userId && m.courseId === input.courseId);
  if (!courseMaterials.length) return { error: 'No materials for this course yet.' };

  const tasks: StudyTask[] = [];
  const weak = weakestTopics(input.courseId, 3);

  if (weak.length) {
    tasks.push({
      id: uid(),
      topic: weak.map((w) => w.concept).join(', '),
      format: 'quiz',
      durationMinutes: Math.max(10, Math.round(input.minutes * 0.4)),
      notes: 'Focus on weak topics first.',
    });
  }

  tasks.push({
    id: uid(),
    topic: 'recent materials',
    format: 'review',
    durationMinutes: Math.max(10, Math.round(input.minutes * 0.3)),
    notes: 'Quick recap of latest uploads.',
  });

  tasks.push({
    id: uid(),
    topic: 'mixed practice',
    format: 'quiz',
    durationMinutes: Math.max(10, input.minutes - tasks.reduce((sum, t) => sum + t.durationMinutes, 0)),
    notes: 'Balance stronger topics to avoid forgetting.',
  });

  const plan: StudyPlan = {
    id: uid(),
    courseId: input.courseId,
    generatedAt: nowIso(),
    targetMinutes: input.minutes,
    tasks,
  };

  return plan;
}
