import { loadState, saveState } from './storage';
import { Course, Deadline, nowIso, uid } from './types';

export type CreateCourseInput = {
  userId: string;
  name: string;
  code?: string;
  instructor?: string;
  term?: string;
};

export function createCourse(input: CreateCourseInput): Course {
  const state = loadState();
  const course: Course = {
    id: uid(),
    userId: input.userId,
    name: input.name,
    code: input.code,
    instructor: input.instructor,
    term: input.term,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    deadlines: [],
  };
  state.courses.push(course);
  saveState(state);
  return course;
}

export function listCourses(userId: string): Course[] {
  const state = loadState();
  return state.courses.filter((c) => c.userId === userId);
}

export function getCourse(userId: string, courseId: string): Course | undefined {
  const state = loadState();
  return state.courses.find((c) => c.userId === userId && c.id === courseId);
}

export type UpdateCourseInput = {
  userId: string;
  courseId: string;
  name?: string;
  code?: string;
  instructor?: string;
  term?: string;
};

export function updateCourse(input: UpdateCourseInput): Course | undefined {
  const state = loadState();
  const course = state.courses.find((c) => c.userId === input.userId && c.id === input.courseId);
  if (!course) return undefined;
  if (input.name) course.name = input.name;
  if (input.code) course.code = input.code;
  if (input.instructor) course.instructor = input.instructor;
  if (input.term) course.term = input.term;
  course.updatedAt = nowIso();
  saveState(state);
  return course;
}

export function deleteCourse(userId: string, courseId: string): boolean {
  const state = loadState();
  const before = state.courses.length;
  state.courses = state.courses.filter((c) => !(c.userId === userId && c.id === courseId));
  if (state.courses.length === before) return false;
  saveState(state);
  return true;
}

export function addDeadline(userId: string, courseId: string, deadline: Omit<Deadline, 'id'>): Deadline | undefined {
  const state = loadState();
  const course = state.courses.find((c) => c.userId === userId && c.id === courseId);
  if (!course) return undefined;
  const entry: Deadline = { ...deadline, id: uid() };
  course.deadlines.push(entry);
  course.updatedAt = nowIso();
  saveState(state);
  return entry;
}
