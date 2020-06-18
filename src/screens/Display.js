import React, { useState, useEffect } from "react";
import Board from "../components/Board";
import Content from "../styles/Content";
import { URL } from "../Constants";
import BigPicture from "../components/BigPicture";

function Display(props) {
  const [formValues, setFormValues] = useState({});
  const [backgroundColour, setBackgroundColour] = useState("#000");
  const [photoMode, setPhotoMode] = useState(false);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("This will run every second!");
      const fetchData = async () => {
        const response = await fetch(URL, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setFormValues(JSON.parse(data.lines));
        setBackgroundColour(data.backgroundColour);
        setPhotoMode(data.photoMode);
        setImageName(data.imageName);
      };
      fetchData();
    }, 1000);
  }, []);

  return (
    <Content>
      {photoMode ? (
        <BigPicture backgroundColour={backgroundColour} imageName={imageName} />
      ) : (
        <Board formValues={formValues} backgroundColour={backgroundColour} />
      )}
    </Content>
  );
}

export default Display;
