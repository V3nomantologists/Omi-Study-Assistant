import { routeIntent } from './intent-router';

const userId = 'demo-user';
const utterances = [
  'Add a course called Biology 101',
  'Quiz me on biology',
  'What should I study today?',
  'Add these notes to my biology class',
];

for (const utterance of utterances) {
  const result = routeIntent({ userId, utterance });
  console.log('Utterance:', utterance);
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('---');
}
