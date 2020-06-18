import React from "react";
import Stack from "../styles/Stack";
import TextContainer from "../styles/TextContainer";
import TextInstance from "../styles/TextInstance";

const Board = ({formValues, backgroundColour, line1Colour, line2Colour, line3Colour }) => {
  console.log(backgroundColour)

  return (
    <Stack>
      <TextContainer backgroundColour={formValues.line1Colour ? formValues.line1Colour : backgroundColour}>
        <TextInstance >{formValues ? formValues.line1 : "" }</TextInstance>
      </TextContainer>
      <TextContainer backgroundColour={formValues.line2Colour ? formValues.line2Colour : backgroundColour}>
        <TextInstance >{formValues ? formValues.line2 : ""}</TextInstance>
      </TextContainer>
      <TextContainer backgroundColour={formValues.line3Colour ? formValues.line3Colour : backgroundColour}>
        <TextInstance >{formValues ? formValues.line3 : ""}</TextInstance>
      </TextContainer>
    </Stack>
  );
};

export default Board;
