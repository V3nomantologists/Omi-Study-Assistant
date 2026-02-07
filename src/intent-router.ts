import { listCourses } from './courses';
import { listMaterials } from './materials';

export type IntentInput = {
  userId: string;
  utterance: string;
  activeCourse?: string;
};

export type ToolRoute = {
  toolName: 'course_tool' | 'material_ingest_tool' | 'material_list_tool' | 'quiz_tool' | 'study_plan_tool';
  action: string;
  args: Record<string, unknown>;
};

export type Clarification = {
  question: string;
};

export type IntentResult = ToolRoute | Clarification;

export function routeIntent(input: IntentInput): IntentResult {
  const text = input.utterance.toLowerCase().trim();

  if (isAddCourse(text)) {
    const name = extractCourseName(text);
    if (name) {
      return { toolName: 'course_tool', action: 'create', args: { userId: input.userId, name } };
    }
    return { question: 'What is the course name?' };
  }

  if (isListCourses(text)) {
    return { toolName: 'course_tool', action: 'list', args: { userId: input.userId } };
  }

  if (isIngest(text)) {
    const courseId = resolveCourse(input.userId, input.activeCourse);
    if (typeof courseId !== 'string') return courseId;
    return {
      toolName: 'material_ingest_tool',
      action: 'ingest',
      args: { userId: input.userId, courseId, title: 'New material', kind: 'text', content: '' },
    };
  }

  if (isQuiz(text)) {
    const courseId = matchCourseFromText(input.userId, text) ?? resolveCourse(input.userId, input.activeCourse);
    if (typeof courseId !== 'string') return courseId;
    const materials = listMaterials(input.userId, courseId);
    if (!materials.length) {
      return { question: 'I need materials for this course first. Want to ingest some notes or a PDF?' };
    }
    return { toolName: 'quiz_tool', action: 'generate', args: { userId: input.userId, courseId, limit: 6 } };
  }

  if (isStudyPlan(text) || isStudyToday(text)) {
    const courseId = matchCourseFromText(input.userId, text) ?? resolveCourse(input.userId, input.activeCourse);
    if (typeof courseId !== 'string') return courseId;
    const materials = listMaterials(input.userId, courseId);
    if (!materials.length) {
      return { question: 'I need materials for this course first. Want to ingest some notes or a PDF?' };
    }
    return { toolName: 'study_plan_tool', action: 'recommend', args: { userId: input.userId, courseId, minutes: 30 } };
  }

  return { question: 'Tell me if you want to add a course, ingest material, quiz, or get a study plan.' };
}

function resolveCourse(userId: string, activeCourse?: string): string | Clarification {
  const courses = listCourses(userId);
  if (activeCourse) {
    const match = courses.find((c) => c.id === activeCourse);
    if (match) return match.id;
  }
  if (courses.length === 1) return courses[0].id;
  if (!courses.length) return { question: 'Which course is this for? You can also add one now.' };
  return { question: 'Which course should I use?' };
}

function isAddCourse(text: string): boolean {
  return includesAny(text, ['add course', 'add a course', 'new course', 'create course']);
}

function isListCourses(text: string): boolean {
  return includesAny(text, ['list courses', 'show courses', 'what courses']);
}

function isIngest(text: string): boolean {
  return (
    includesAny(text, ['upload', 'ingest', 'add material', 'add pdf', 'add document', 'attach file']) ||
    /add .*notes/.test(text) ||
    /upload .*notes/.test(text)
  );
}

function isQuiz(text: string): boolean {
  return includesAny(text, ['quiz', 'flashcard', 'drill']);
}

function isStudyPlan(text: string): boolean {
  return includesAny(text, ['study plan', 'plan study', 'study schedule']);
}

function isStudyToday(text: string): boolean {
  return includesAny(text, ['what should i study today', 'study today', 'what to study today']);
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((p) => text.includes(p));
}

function extractCourseName(text: string): string | undefined {
  let cleaned = text
    .replace(/add( a)? course/, '')
    .replace(/create course/, '')
    .replace(/new course/, '')
    .replace(/^called\s+/, '')
    .replace(/^named\s+/, '')
    .trim();
  cleaned = cleaned.replace(/^called\s+/, '').replace(/^named\s+/, '').trim();
  if (cleaned.length > 0) return cleaned;
  return undefined;
}

function matchCourseFromText(userId: string, text: string): string | undefined {
  const courses = listCourses(userId);
  const normalizedText = text.toLowerCase();
  let best: { id: string; score: number } | undefined;
  for (const course of courses) {
    const name = course.name.toLowerCase();
    const tokens = name.split(/\s+/).filter(Boolean);
    const score = tokens.reduce((acc, token) => (normalizedText.includes(token) ? acc + 1 : acc), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { id: course.id, score };
    }
  }
  return best?.id;
}
