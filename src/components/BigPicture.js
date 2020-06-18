import React from "react";
import styled from "styled-components";
import { URL } from "../Constants";

const BigPicture = ({backgroundColour, imageName}) => {
  return <BigImage backgroundColour={backgroundColour} imageName={imageName}/>
};

const BigImage = styled.div`
  width: 100vw;
  height: 100vh;
<<<<<<< HEAD
  background-image: url(${`${URL}/image`});
  background-size: cover;
=======
  background-image: ${props => `url(${URL}/image?name=${props.imageName})`};
>>>>>>> 8a1bb659c89e2260e039bb64b0e002f62bb31e5b
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: ${props => props.backgroundColour};
  overflow: hidden
`;
export default BigPicture;
