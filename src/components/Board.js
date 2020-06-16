import React, { useState, useEffect } from "react";
import Stack from "../styles/Stack";
import TextContainer from "../styles/TextContainer";
import TextInstance from "../styles/TextInstance";
import { URL } from "../Constants";

const Board = () => {
  const [formValues, setFormValues] = useState({});
  const [backgroundColour, setBackgroundColour] = useState("#000");

  useEffect(() => {
      const interval = setInterval(() => {
        console.log('This will run every second!');
      const fetchData = async () => {
      const response = await fetch(URL, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setFormValues(JSON.parse(data.lines));
      setBackgroundColour(data.backgroundColour);
    };
    fetchData();
    }, 1000);
  }, []);

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
