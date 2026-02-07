// Adapter layer to expose domain functions as Omi tools.
// No business logic added here; all behavior stays in domain modules.

import { createCourse, addDeadline, listCourses, updateCourse, deleteCourse, getCourse } from './courses';
import { ingestMaterial, listMaterials } from './materials';
import { generateQuiz, submitQuizResults } from './quizzes';
import { recommendStudyPlan } from './plans';
import { QuizResponse } from './types';

// Tool: course_tool
export type CourseAction = 'create' | 'list' | 'get' | 'update' | 'delete' | 'addDeadline';

export type CourseToolInput =
  | { action: 'create'; userId: string; name: string; code?: string; instructor?: string; term?: string }
  | { action: 'list'; userId: string }
  | { action: 'get'; userId: string; courseId: string }
  | { action: 'update'; userId: string; courseId: string; name?: string; code?: string; instructor?: string; term?: string }
  | { action: 'delete'; userId: string; courseId: string }
  | { action: 'addDeadline'; userId: string; courseId: string; title: string; type: 'exam' | 'assignment' | 'milestone'; dueDate: string };

export type CourseToolOutput = unknown;

export function course_tool(input: CourseToolInput): CourseToolOutput {
  switch (input.action) {
    case 'create':
      return createCourse({
        userId: input.userId,
        name: input.name,
        code: input.code,
        instructor: input.instructor,
        term: input.term,
      });
    case 'list':
      return listCourses(input.userId);
    case 'get':
      return getCourse(input.userId, input.courseId) ?? { error: 'Course not found' };
    case 'update':
      return updateCourse({
        userId: input.userId,
        courseId: input.courseId,
        name: input.name,
        code: input.code,
        instructor: input.instructor,
        term: input.term,
      }) ?? { error: 'Course not found' };
    case 'delete':
      return deleteCourse(input.userId, input.courseId) ? { ok: true } : { error: 'Course not found' };
    case 'addDeadline':
      return (
        addDeadline(input.userId, input.courseId, {
          title: input.title,
          type: input.type,
          dueDate: input.dueDate,
        }) ?? { error: 'Course not found' }
      );
    default:
      return { error: 'Unsupported action' };
  }
}

// Tool: material_ingest_tool
export type MaterialIngestToolInput = {
  userId: string;
  courseId: string;
  title: string;
  kind: 'pdf' | 'text' | 'voice';
  content: string;
  sourceRef?: string;
};

export function material_ingest_tool(input: MaterialIngestToolInput) {
  return ingestMaterial(input);
}

export type MaterialListToolInput = {
  userId: string;
  courseId: string;
};

export function material_list_tool(input: MaterialListToolInput) {
  return listMaterials(input.userId, input.courseId);
}

// Tool: quiz_tool
export type QuizAction = 'generate' | 'submit';

export type QuizToolInput =
  | { action: 'generate'; userId: string; courseId: string; topic?: string; limit?: number }
  | { action: 'submit'; courseId: string; sessionId: string; responses: QuizResponse[] };

export function quiz_tool(input: QuizToolInput) {
  if (input.action === 'generate') {
    return generateQuiz({
      userId: input.userId,
      courseId: input.courseId,
      topic: input.topic,
      limit: input.limit,
    });
  }
  return submitQuizResults(input.courseId, {
    sessionId: input.sessionId,
    responses: input.responses,
  });
}

// Tool: study_plan_tool
export type StudyPlanToolInput = {
  userId: string;
  courseId: string;
  minutes: number;
};

export function study_plan_tool(input: StudyPlanToolInput) {
  return recommendStudyPlan(input);
}
