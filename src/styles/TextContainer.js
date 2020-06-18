import styled from "styled-components";
const TextContainer = styled.div`
  flex: 0 0 100%;
  height: 33.3vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.backgroundColour}

  &:not(:first-child):before {
    content: "";
    top: -5%;
    width: 100vw;
    height: 2rem;
    background-color: rgba(0, 0, 0, 1);
    opacity: 0.15;
    position: absolute;
    box-shadow: 2px 2px 2px 1px rgba(10, 10, 10, 1);
  }
`;
export default TextContainer;
