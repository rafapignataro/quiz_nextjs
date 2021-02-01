import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import Lottie from 'react-lottie';

import loadingAnimation from './animation.json';

import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import QuizLogo from '../../components/QuizLogo';
import Widget from '../../components/Widget';
import Button from '../../components/Button';
import AlternativesForm from '../../components/AlternativesForm';
import BackLinkArrow from '../../components/BackLinkArrow';
import Link from '../../components/Link';

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>
      <Widget.Content>
        <Lottie
          options={defaultOptions}
          height={100}
          width={100}
          isStopped={false}
          isPaused={false}
        />
      </Widget.Content>
    </Widget>
  );
}

function ResultWidget({ results }) {
  const totalCorrectQuestions = results.reduce(
    (sum, curr) => (curr.isCorrect ? sum + 1 : sum),
    0
  );

  const result_colors = {
    wrong: '#FF5722',
    success: '#4CAF50',
  };

  return (
    <>
      <Widget>
        <Widget.Header>Resultado</Widget.Header>
        <Widget.Content>
          <p>{`Você acertou ${totalCorrectQuestions} perguntas!`}</p>
          <p>Cheque abaixo os resultados por questão!</p>
          <Link href={'/'} style={{ textDecoration: 'none' }}>
            <Button as="a">Realizar novamente</Button>
          </Link>
        </Widget.Content>
      </Widget>
      {results.map((result, resultIndex) => (
        <Widget key={`result__${resultIndex}`}>
          <Widget.Header>{`Questão ${resultIndex + 1}`}</Widget.Header>
          <Widget.Content>
            <h2>{result.question_title}</h2>
            <p>{`Sua resposta: ${result.user_answer}`}</p>
            <p>{`Resposta correta: ${result.correct_answer}`}</p>
            <Widget.Topic
              style={{
                backgroundColor: `${
                  result.isCorrect ? result_colors.success : result_colors.wrong
                }`,
              }}
            >
              {`Resultado: ${result.isCorrect ? 'Acertou' : 'Errou'}`}
            </Widget.Topic>
          </Widget.Content>
        </Widget>
      ))}
    </>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);

  const questionId = `question__${questionIndex}`;

  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>

        <AlternativesForm
          onSubmit={(event) => {
            event.preventDefault();
            setIsQuestionSubmited(true);

            setTimeout(() => {
              addResult({
                isCorrect,
                question_title: question.title,
                correct_answer: question.alternatives[question.answer],
                user_answer: question.alternatives[selectedAlternative],
              });
              onSubmit(event);
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 3000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternative_id = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;

            return (
              <Widget.Topic
                as="label"
                htmlFor={alternative_id}
                key={alternative_id}
                data-status={isQuestionSubmited && alternativeStatus}
                data-selected={isSelected}
              >
                <input
                  id={alternative_id}
                  type="radio"
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>

          {isQuestionSubmited && isCorrect && <p>Voce acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Voce errou!</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

export default function QuizPage({ db }) {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [results, setResults] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const totalQuestions = db.questions.length;
  const question = db.questions[questionIndex];

  function addResult(result) {
    setResults([...results, result]);
  }

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1000);
  }, []);

  function handleQuizSubmit(event) {
    event.preventDefault();

    const nextQuestionIndex = questionIndex + 1;

    if (nextQuestionIndex === totalQuestions) {
      setScreenState(screenStates.RESULT);
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />

        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleQuizSubmit}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && (
          <ResultWidget
            as={motion.section}
            transition={{ delay: 0.4, duration: 0.5 }}
            variants={{
              show: { opacity: 1, x: '0' },
              hidden: { opacity: 0, x: '-100%' },
            }}
            initial="hidden"
            animate="show"
            results={results}
          />
        )}
      </QuizContainer>
    </QuizBackground>
  );
}
