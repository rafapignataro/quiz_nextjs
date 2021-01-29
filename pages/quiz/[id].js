import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';

export default function ExternalQuizPage({ db }) {
  return (
    <ThemeProvider theme={db.theme}>
      <QuizScreen db={db} />
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  const [projectName, userName] = id.split('___');

  try {
    const response = await fetch(
      `https://${projectName}.${userName}.vercel.app/api/db`
    );
    const data = await response.json();

    return {
      props: {
        db: data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        externalDb: null,
      },
    };
  }
}
