import React from "react";
import Stack from "../styles/Stack";
import TextContainer from "../styles/TextContainer";
import TextInstance from "../styles/TextInstance";

const Board = ({formValues, backgroundColour, line1Colour, line2Colour, line3Colour }) => {
  console.log(backgroundColour)
  
  return (
    <Stack>
      <TextContainer>
        <TextInstance line1Colour={formValues.line1Colour ? formValues.line1Colour : backgroundColour}>{formValues ? formValues.line1 : "" }</TextInstance>
      </TextContainer>
      <TextContainer>
        <TextInstance line2Colour={formValues.line1Colour ? formValues.line2Colour : backgroundColour}>{formValues ? formValues.line2 : ""}</TextInstance>
      </TextContainer>
      <TextContainer>
        <TextInstance line3Colour={formValues.line1Colour ? formValues.line3Colour : backgroundColour}>{formValues ? formValues.line3 : ""}</TextInstance>
      </TextContainer>
    </Stack>
  );
};

export default Board;
