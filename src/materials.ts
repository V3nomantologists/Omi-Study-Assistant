import { loadState, saveState } from './storage';
import { Chunk, Material, nowIso, uid } from './types';

export type IngestMaterialInput = {
  userId: string;
  courseId: string;
  title: string;
  kind: 'pdf' | 'text' | 'voice';
  content: string;
  sourceRef?: string;
};

export function ingestMaterial(input: IngestMaterialInput): Material {
  const state = loadState();
  const chunks = chunkText(input.content).map<Chunk>((text) => ({
    id: uid(),
    courseId: input.courseId,
    materialId: '',
    text,
    sourceRef: input.sourceRef,
    importance: undefined,
  }));

  const materialId = uid();
  const material: Material = {
    id: materialId,
    userId: input.userId,
    courseId: input.courseId,
    title: input.title,
    kind: input.kind,
    sourceRef: input.sourceRef,
    chunks: chunks.map((c) => ({ ...c, materialId })),
    createdAt: nowIso(),
  };

  state.materials.push(material);
  saveState(state);
  return material;
}

export function listMaterials(userId: string, courseId: string): Material[] {
  const state = loadState();
  return state.materials.filter((m) => m.userId === userId && m.courseId === courseId);
}

function chunkText(content: string, maxLength = 320): string[] {
  if (!content.trim()) return [];
  const sentences = content.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length > maxLength && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
