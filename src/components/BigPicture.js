import React from "react";
import styled from "styled-components";
import { URL } from "../Constants";

const BigPicture = ({backgroundColour}) => {
  return <BigImage backgroundColour={backgroundColour} />
};

const BigImage = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${`${URL}/image`});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: ${props => props.backgroundColour};
  overflow: hidden
`;
export default BigPicture;
