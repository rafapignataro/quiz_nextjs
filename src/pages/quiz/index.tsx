import React from 'react';

import db from '../../../db.json';
import QuizScreen from '../../../src/screens/Quiz';

export default function InternalQuizPage() {
  return <QuizScreen db={db} />;
}
