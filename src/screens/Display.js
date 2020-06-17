import React, { useState, useEffect } from "react";
import Board from "../components/Board";
import Content from "../styles/Content";
import { URL } from "../Constants";
import BigPicture from '../components/BigPicture';

function Display(props) {
  const [formValues, setFormValues] = useState({});
  const [backgroundColour, setBackgroundColour] = useState("#000");
  const [image, setImage] = useState();
  const [photoMode, setPhotoMode] = useState(false);

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
        if (data.image) {
          setImage(data.image);
        }
      };
      fetchData();
    }, 1000);
  }, []);
  return (
    <Content>
      {photoMode ? (
        <BigPicture image={image} />
      ) : (
        <Board formValues={formValues} backgroundColour={backgroundColour} />
      )}
    </Content>
  );
}

export default Display;
