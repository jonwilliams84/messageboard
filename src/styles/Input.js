import styled from "styled-components";

const Input = styled.input`
  font-family: Bebas Neue;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 50px;
  width: 180px;
  border-width: 2px;
  border-color: #000000;
  border-style: solid;
  border-radius: 5px;
  font-size: 25px;
  text-align: center;
  background: ${props => props.backgroundColour};
`;

export default Input;
