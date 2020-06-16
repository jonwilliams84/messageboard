import styled from "styled-components";
const TextContainer = styled.div`
  flex: 0 0 100%;
  height: 20vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  /* &:not(:last-child) {
    margin-bottom: 3rem;
  } */
  &:not(:first-child):before {
    content: "";
    top: -14%;
    width: 100vw;
    height: 2rem;
    background-color: rgba(0, 0, 0, 1);
    opacity: 0.15;
    position: absolute;
    box-shadow: 2px 2px 2px 1px rgba(10, 10, 10, 1);
  }
`;
export default TextContainer;
