import styled from "styled-components";

const Stack = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  background-color: ${props => props.backgroundColour};
  overflow: hidden;
`;

export default Stack;