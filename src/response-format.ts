import { Course, Material, QuizSession, StudyPlan } from './types';

export const onboardingLine = "I'll only use the courses and materials you add.";

export function summarizeCourseCreated(course: Course): string {
  const name = titleCaseCourse(course.name);
  return `Added ${name}. You can set deadlines or ingest materials next.`;
}

export function summarizeMaterialIngest(material: Material): string {
  const chunkCount = material.chunks.length;
  const base = `Ingested ${material.title} for this course${chunkCount ? `; ${chunkCount} chunks stored` : ''}.`;
  if (chunkCount <= 1) return `${base} Based on what you've added, I can start small.`;
  return base;
}

export function summarizeQuiz(session: QuizSession | { error: string }): string {
  if ('error' in session) return session.error;
  if (!session.questions.length) {
    return "I don’t have enough material yet to make a quiz. Want to add notes or a PDF? If you just added something, I can review that first.";
  }
  const note = session.questions.length <= 2 ? ' based on what you have so far' : '';
  return `I made a ${session.questions.length}-question quiz${note}.`;
}

export function summarizeStudyPlan(plan: StudyPlan | { error: string }): string {
  if ('error' in plan) return plan.error;
  const onlyRecent = plan.tasks.length === 1 && plan.tasks[0].topic.includes('recent materials');
  if (onlyRecent) {
    return "I don’t have much material yet, so let’s start by reviewing what you just added.";
  }
  const tasks = plan.tasks.map((t) => describeTask(t));
  const sequence = tasks.length > 1 ? tasks.join(', then ') : tasks[0];
  const note = plan.tasks.length <= 2 ? ' based on what you have so far' : '';
  return `Here’s your ${plan.targetMinutes}-minute plan${note}: ${sequence}.`;
}

function titleCaseCourse(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function describeTask(task: { format: string; topic: string; durationMinutes?: number }): string {
  const base = task.format === 'quiz' ? 'Do a short quiz' : task.format === 'review' ? 'Review' : 'Recap';
  const topic = task.topic ? ` on ${task.topic}` : '';
  const duration = task.durationMinutes ? ` (${task.durationMinutes} min)` : '';
  return `${base}${topic}${duration}`;
}
