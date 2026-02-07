import { describe, it, expect, beforeEach } from 'vitest';
import { routeIntent } from './intent-router';
import { createCourse } from './courses';
import { ingestMaterial } from './materials';

const userId = 'demo-user';

describe('intent router golden paths', () => {
  beforeEach(() => {
    // No state reset here to avoid changing core logic; tests rely on inserts below.
  });

  it('routes add course to course_tool.create', () => {
    const result = routeIntent({ userId, utterance: 'Add a course called Biology 101' });
    expect('toolName' in result && result.toolName).toBe('course_tool');
    expect('action' in result && result.action).toBe('create');
    expect('args' in result && (result as any).args.name).toBe('biology 101');
  });

  it('routes quiz when course and material exist', () => {
    const course = createCourse({ userId, name: 'Biology 101' });
    ingestMaterial({
      userId,
      courseId: course.id,
      title: 'Notes',
      kind: 'text',
      content: 'Cell biology introduction and basic concepts.',
    });
    const result = routeIntent({ userId, utterance: 'Quiz me on biology', activeCourse: course.id });
    expect('toolName' in result && result.toolName).toBe('quiz_tool');
    expect('action' in result && result.action).toBe('generate');
  });

  it('routes study plan when course and material exist', () => {
    const course = createCourse({ userId, name: 'Biology 102' });
    ingestMaterial({
      userId,
      courseId: course.id,
      title: 'Week 1',
      kind: 'text',
      content: 'Introduction to genetics and DNA structure.',
    });
    const result = routeIntent({ userId, utterance: 'What should I study today?', activeCourse: course.id });
    expect('toolName' in result && result.toolName).toBe('study_plan_tool');
    expect('action' in result && result.action).toBe('recommend');
  });
});
