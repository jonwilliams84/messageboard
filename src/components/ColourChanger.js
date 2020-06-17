import React, { useState } from "react";
import { SketchPicker } from "react-color";

const ColourPicker = ({ backgroundColour, handleBackgroundColourChange }) => {
  const [showColourPicker, setShowColourPicker] = useState(false);

  const handleClick = () => {
    setShowColourPicker(!showColourPicker);
  };

  const handleClose = () => {
    setShowColourPicker(false);
  };

  const colour = {
    marginTop: "5rem",
    width: "8rem",
    height: "8rem",
    borderRadius: "50%",
    background: `${backgroundColour}`,
    cursor: "pointer",
  };
  const swatch = {
    padding: "5px",
    background: "#fff",
    borderRadius: "1px",
    boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
    display: "inline-block",
    cursor: "pointer",
  };
  const popover = {
    position: "absolute",
    zIndex: "2",
    top: "30%",
    left: "25%",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  return (
    <div>
      <div style={colour} onClick={handleClick}>
      </div>
      {showColourPicker ? (
      <div style={popover}>
        <div style={cover} onClick={handleClose} />
        <SketchPicker
          color={backgroundColour}
          onChange={handleBackgroundColourChange}
        />
      </div>
      ) : null}
    </div>
  );
};

export default ColourPicker;
