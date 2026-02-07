import { routeIntent } from './intent-router';
import { registerOmiTools, OmiContext } from './register-tools';
import {
  course_tool,
  material_ingest_tool,
  material_list_tool,
  quiz_tool,
  study_plan_tool,
} from './omi-tools';
import {
  summarizeCourseCreated,
  summarizeMaterialIngest,
  summarizeQuiz,
  summarizeStudyPlan,
} from './response-format';

const registry = new Map<string, (args: any, context: OmiContext) => any>();

registerOmiTools((name, handler) => {
  registry.set(name, handler);
});

const userId = 'demo-user';
let activeCourse: string | undefined;

const utterances = [
  'Add a course called Biology 101',
  'Add these notes to Biology 101',
  'Quiz me on biology',
  'What should I study today?',
];

for (const utterance of utterances) {
  console.log(`User: ${utterance}`);
  const routed = routeIntent({ userId, utterance, activeCourse });
  if ('question' in routed) {
    console.log(`Assistant: ${routed.question}`);
  } else {
    const handler = registry.get(routed.toolName);
    if (!handler) {
      console.log(`Assistant: No handler for ${routed.toolName}`);
    } else {
      const result = handler({ ...routed.args, action: routed.action }, { userId });
      if (
        routed.toolName === 'course_tool' &&
        result &&
        typeof result === 'object' &&
        'id' in result &&
        typeof (result as any).id === 'string'
      ) {
        activeCourse = (result as any).id;
      }
      console.log('Assistant:', formatResponse(routed.toolName, result));
    }
  }
  console.log('---');
}

function formatResponse(toolName: string, result: any): string {
  switch (toolName) {
    case 'course_tool':
      return result && typeof result === 'object' && 'name' in result ? summarizeCourseCreated(result) : String(result);
    case 'material_ingest_tool':
      return result && typeof result === 'object' && 'title' in result ? summarizeMaterialIngest(result) : String(result);
    case 'quiz_tool':
      return summarizeQuiz(result);
    case 'study_plan_tool':
      return summarizeStudyPlan(result);
    default:
      return typeof result === 'string' ? result : JSON.stringify(result);
  }
}
