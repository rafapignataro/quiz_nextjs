import styled from 'styled-components';

const QuizBackground = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-color: #ffffff;
  flex: 1;
  @media screen and (max-width: 500px) {
    background-image: none;
    &:after {
      content: '';
      background-size: cover;
      background-position: top;
      background-image: url(${({ backgroundImage }) => backgroundImage});
      display: block;
      width: 100%;
      height: 210px;
      position: absolute;
      top: -20px;
      left: 0;
      right: 0;
      z-index: 1;
    }
    *:first-child {
      position: relative;
      z-index: 10;
    }
  }
`;

export default QuizBackground;
