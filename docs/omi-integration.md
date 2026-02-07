# Omi Tool Integration Guide

Goal: register the existing tool handlers with Omi’s tool system, passing the real `userId` from Omi context. No business logic changes.

## Tool exports
- course_tool (create/list/get/update/delete/addDeadline)
- material_ingest_tool
- material_list_tool
- quiz_tool (generate/submit)
- study_plan_tool

All live in `src/omi-tools.ts` and expect `userId` provided by Omi.

## Example registration (pseudo-code)
```ts
import {
  course_tool,
  material_ingest_tool,
  material_list_tool,
  quiz_tool,
  study_plan_tool,
} from './omi-tools';

// Pseudo Omi host API; replace with actual registration hook.
function registerTools(register: (name: string, handler: (args: any) => any) => void) {
  register('course_tool', (args, context) => course_tool({ ...args, userId: context.userId }));
  register('material_ingest_tool', (args, context) => material_ingest_tool({ ...args, userId: context.userId }));
  register('material_list_tool', (args, context) => material_list_tool({ ...args, userId: context.userId }));
  register('quiz_tool', (args, context) => quiz_tool({ ...args, userId: context.userId }));
  register('study_plan_tool', (args, context) => study_plan_tool({ ...args, userId: context.userId }));
}
```

Notes:
- Handlers are stateless; persistence remains flat JSON at `data/state.json`.
- Inputs/outputs are serializable and voice-safe; no UI assumptions.
- Do not alter signatures; only inject `context.userId`.
- Keep demo flow runnable (`npm start`) as a regression check.
