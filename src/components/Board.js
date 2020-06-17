import React from "react";
import Stack from "../styles/Stack";
import TextContainer from "../styles/TextContainer";
import TextInstance from "../styles/TextInstance";

const Board = ({formValues, backgroundColour}) => {
  console.log(backgroundColour)

  return (
    <Stack backgroundColour={backgroundColour}>
      <TextContainer>
        <TextInstance>{formValues ? formValues.line1 : ""}</TextInstance>
      </TextContainer>
      <TextContainer>
        <TextInstance>{formValues ? formValues.line2 : ""}</TextInstance>
      </TextContainer>
      <TextContainer>
        <TextInstance>{formValues ? formValues.line3 : ""}</TextInstance>
      </TextContainer>
    </Stack>
  );
};

export default Board;
