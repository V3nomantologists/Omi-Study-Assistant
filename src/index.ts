import { createCourse, addDeadline } from './courses';
import { ingestMaterial } from './materials';
import { generateQuiz, submitQuizResults } from './quizzes';
import { recommendStudyPlan } from './plans';
import { QuizResponse } from './types';

async function runDemoFlow() {
  const userId = 'demo-user';

  const course = createCourse({
    userId,
    name: 'Psych 101',
    instructor: 'Dr. Lee',
    term: 'Fall',
  });

  addDeadline(userId, course.id, {
    title: 'Midterm',
    type: 'exam',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  ingestMaterial({
    userId,
    courseId: course.id,
    title: 'Week 1 Notes',
    kind: 'text',
    content: 'Classical conditioning pairs a neutral stimulus with an unconditioned stimulus to elicit a conditioned response. Operant conditioning uses reinforcement and punishment to shape behavior.',
    sourceRef: 'notes/week1',
  });

  const quiz = generateQuiz({ userId, courseId: course.id, topic: 'conditioning', limit: 3 });
  if ('error' in quiz) {
    console.error('Quiz error', quiz.error);
    return;
  }

  const responses: QuizResponse[] = quiz.questions.map((q) => ({ questionId: q.id, correct: true }));
  submitQuizResults(course.id, { sessionId: quiz.id, responses });

  const plan = recommendStudyPlan({ userId, courseId: course.id, minutes: 30 });
  if ('error' in plan) {
    console.error('Plan error', plan.error);
    return;
  }

  console.log('Plan tasks:', plan.tasks);
}

runDemoFlow();
