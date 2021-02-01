import { GetServerSideProps } from 'next';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../../src/screens/Quiz';
import db from '../../../db.json';

interface Props {
  db: typeof db;
}

export default function ExternalQuizPage({ db }: Props) {
  return (
    <ThemeProvider theme={db.theme}>
      <QuizScreen db={db} />
    </ThemeProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as string;

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
};
