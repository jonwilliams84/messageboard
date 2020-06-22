import React from "react";
import Input from "../styles/Input";

const FormText = ({ backgroundColour, label, defaultValue, name, validation, onChange, maxLength }) => (
  <Input
    backgroundColour={backgroundColour}
    placeholder={label}
    value={defaultValue}
    name={name}
    ref={validation}
    type="text"
    maxLength={maxLength}
    onChange={(e) => onChange(e.target.name, e.target.value)}
  />
);

export default FormText;
