import { loadState, saveState } from './storage';
import { Chunk, QuizQuestion, QuizResponse, QuizSession, nowIso, uid } from './types';
import { recordQuizResults } from './mastery';

export type GenerateQuizInput = {
  userId: string;
  courseId: string;
  topic?: string;
  limit?: number;
};

export type QuizResultInput = {
  sessionId: string;
  responses: QuizResponse[];
};

export function generateQuiz(input: GenerateQuizInput): QuizSession | { error: string } {
  const state = loadState();
  const materials = state.materials.filter((m) => m.userId === input.userId && m.courseId === input.courseId);
  if (!materials.length) return { error: 'No materials for this course yet.' };

  const chunks = materials.flatMap((m) => m.chunks);
  const selected = selectChunks(chunks, input.limit ?? 6);
  const questions = selected.map<QuizQuestion>((chunk) => ({
    id: uid(),
    courseId: input.courseId,
    prompt: buildPrompt(chunk, input.topic),
    answer: chunk.text,
    sourceChunkId: chunk.id,
    difficulty: 'medium',
    format: 'flashcard',
  }));

  const session: QuizSession = {
    id: uid(),
    courseId: input.courseId,
    createdAt: nowIso(),
    questions,
    responses: [],
  };

  state.quizSessions.push(session);
  saveState(state);
  return session;
}

export function submitQuizResults(courseId: string, input: QuizResultInput): QuizSession | { error: string } {
  const state = loadState();
  const session = state.quizSessions.find((s) => s.id === input.sessionId && s.courseId === courseId);
  if (!session) return { error: 'Quiz session not found.' };

  session.responses = input.responses;
  saveState(state);

  const concept = deriveConceptLabel(session.questions);
  recordQuizResults(courseId, concept, input.responses);
  return session;
}

function selectChunks(chunks: Chunk[], limit: number): Chunk[] {
  const unique = new Map<string, Chunk>();
  for (const chunk of chunks) {
    if (!unique.has(chunk.text)) {
      unique.set(chunk.text, chunk);
    }
  }
  return Array.from(unique.values()).slice(0, limit);
}

function buildPrompt(chunk: Chunk, topic?: string): string {
  const topicHint = topic ? ` (topic: ${topic})` : '';
  return `Recall the key point${topicHint}: ${chunk.text.slice(0, 120)}`;
}

function deriveConceptLabel(questions: QuizQuestion[]): string {
  if (!questions.length) return 'general';
  const sample = questions[0].prompt;
  return sample.length > 40 ? sample.slice(0, 40) : sample;
}
