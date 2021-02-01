import styled from 'styled-components';

const QuizContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 350px;
  padding-top: 20px;
  margin: auto 10%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default QuizContainer;
