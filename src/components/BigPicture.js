import React from "react";
import styled from "styled-components";
import { URL } from "../Constants";

const BigPicture = ({backgroundColour, imageName}) => {
  return <BigImage backgroundColour={backgroundColour} imageName={imageName}/>
};

const BigImage = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: ${props => `url(${URL}/image?name=${props.imageName})`};
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: ${props => props.backgroundColour};
  overflow: hidden
`;
export default BigPicture;
