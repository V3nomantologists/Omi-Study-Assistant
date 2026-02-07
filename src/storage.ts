import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { Course, MasteryRecord, Material, QuizSession } from './types';

export type PersistedState = {
  courses: Course[];
  materials: Material[];
  mastery: MasteryRecord[];
  quizSessions: QuizSession[];
};

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATE_PATH = path.join(DATA_DIR, 'state.json');

const defaultState: PersistedState = {
  courses: [],
  materials: [],
  mastery: [],
  quizSessions: [],
};

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadState(): PersistedState {
  ensureDataDir();
  if (!existsSync(STATE_PATH)) {
    return { ...defaultState };
  }
  try {
    const raw = readFileSync(STATE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      courses: parsed.courses ?? [],
      materials: parsed.materials ?? [],
      mastery: parsed.mastery ?? [],
      quizSessions: parsed.quizSessions ?? [],
    };
  } catch (err) {
    console.error('Failed to load state, returning defaults', err);
    return { ...defaultState };
  }
}

export function saveState(state: PersistedState): void {
  ensureDataDir();
  const serialized = JSON.stringify(state, null, 2);
  writeFileSync(STATE_PATH, serialized, 'utf8');
}
