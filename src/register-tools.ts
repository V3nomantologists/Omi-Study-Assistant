// Registers Omi tool handlers by injecting the caller's userId into each domain adapter.
// No business logic changes; this is just wiring.

import {
  course_tool,
  material_ingest_tool,
  material_list_tool,
  quiz_tool,
  study_plan_tool,
} from './omi-tools';

export type OmiContext = {
  userId: string;
};

export type ToolRegistrar = (name: string, handler: (args: any, context: OmiContext) => any) => void;

export function registerOmiTools(register: ToolRegistrar) {
  register('course_tool', (args, context) => course_tool({ ...args, userId: context.userId }));
  register('material_ingest_tool', (args, context) => material_ingest_tool({ ...args, userId: context.userId }));
  register('material_list_tool', (args, context) => material_list_tool({ ...args, userId: context.userId }));
  register('quiz_tool', (args, context) => quiz_tool({ ...args, userId: context.userId }));
  register('study_plan_tool', (args, context) => study_plan_tool({ ...args, userId: context.userId }));
}
