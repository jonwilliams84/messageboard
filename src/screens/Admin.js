import React, { useState, useEffect } from "react";
// import Content from "../styles/Content";
import FormText from "../components/FormText";
import ColourPicker from "../components/ColourChanger";
import AdminContent from "../styles/AdminContent";
import MessageBoardAdmin from "../styles/MessageBoardAdmin";
// import FormInput from "../styles/FormInput";
// import ButtonStack from "../styles/ButtonStack";
// import Button from "../styles/Button";
// import ButtonOverlay from "../styles/ButtonOverlay";
// import ButtonSpan from "../styles/ButtonSpan";
import { ADMIN_URL as URL } from "../Constants";
import MaterialUISwitch from "@material-ui/core/Switch";
import UploadButton from "../styles/UploadButton";
import PhotoMode from "../styles/PhotoMode";
import PhotoEnable from "../styles/PhotoEnable";
import PhotoEnableSwitch from "../styles/PhotoEnableSwitch";
import ApplyButton from "../styles/ApplyButton";
import styled from "styled-components";

const Admin = () => {
  const [formValues, setFormValues] = useState({});
  const [backgroundColour, setBackgroundColour] = useState("#000");
  const [image, setImage] = useState();
  const [imageName, setImageName] = useState("");
  const [photoMode, setPhotoMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(URL, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setFormValues(JSON.parse(data.lines));
      setBackgroundColour(data.backgroundColour);
      setPhotoMode(data.photoMode);
      if (data.image) {
        setImageName(data.imageName);
        setImage(data.image);
      }
    };
    fetchData();
  }, []);

  const updateLine = (name, value) => {
    const newFormValues = { ...formValues, [name]: value };
    setFormValues(newFormValues);
  };

  const handleBackgroundColourChange = (colour, line) => {
    // TODO update this maybe a switch statement so it changes the background colour line here?
    console.log(line)
    setBackgroundColour(colour.hex);
  };

  const setSettings = async () => {
    const body = {
      lines: JSON.stringify(formValues),
      backgroundColour: backgroundColour,
      photoMode: photoMode,
    };
    if (image && photoMode) {
      body.imageName = imageName;
      body.image = image;
    }
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const status = await response.status;
    if (status === 200) {
      alert("Done");
    }
  };

  const imageChange = (imageList) => {
    setImageName(imageList[0].file.name);
    setImage(imageList[0].dataURL);
  };

  const photoModeChange = () => {
    setPhotoMode(!photoMode);
  };

  return (
    <AdminContent>
      <MessageBoardAdmin>Message Board {"\n"}Admin</MessageBoardAdmin>
      <InputWrapper>
        <FormText
          defaultValue={formValues.line1 ? formValues.line1 : ""}
          label="LINE 1"
          name="line1"
          onChange={updateLine}
          maxLength={15}
          backgroundColour={backgroundColour}
        ></FormText>
        <ColourPicker
          backgroundColour={backgroundColour}
          handleBackgroundColourChange={(colour) => handleBackgroundColourChange(colour, "1")}
          height='5rem'
          width='5rem'
        />
      </InputWrapper>
      <InputWrapper>
        <FormText
          defaultValue={formValues.line2 ? formValues.line2 : ""}
          label="LINE 2"
          name="line2"
          onChange={updateLine}
          maxLength={15}
          backgroundColour={backgroundColour}
        ></FormText>
        <ColourPicker
          backgroundColour={backgroundColour}
          handleBackgroundColourChange={(colour) => handleBackgroundColourChange(colour, "2")}
          height='5rem'
          width='5rem'
        />
      </InputWrapper>
      <InputWrapper>
        <FormText
          defaultValue={formValues.line3 ? formValues.line3 : ""}
          label="LINE 3"
          name="line3"
          onChange={updateLine}
          maxLength={15}
          backgroundColour={backgroundColour}
        ></FormText>
        <ColourPicker
          backgroundColour={backgroundColour}
          handleBackgroundColourChange={(colour) => handleBackgroundColourChange(colour, "3")}
          height='5rem'
          width='5rem'
        />
      </InputWrapper>
      <ColourPicker
        backgroundColour={backgroundColour}
        handleBackgroundColourChange={(colour) => handleBackgroundColourChange(colour, "all")}
        height='8rem'
        width='8rem'
      />
      <PhotoEnable>
        <PhotoMode>Photo Mode</PhotoMode>
        <PhotoEnableSwitch>
          <MaterialUISwitch
            onChange={photoModeChange}
            color="primary"
            checked={photoMode}
            style={{ color: "rgba(74,144,226,1)" }}
          ></MaterialUISwitch>
        </PhotoEnableSwitch>
        {photoMode && (
          <UploadButton
            imageChange={imageChange}
            image={image}
            photoMode={photoMode}
            style={{
              width: 60,
              height: 60,
              backgroundColor: "rgba(0,0,0,1)",
              marginLeft: 0,
              marginTop: 20,
              cursor: "pointer",
            }}
            chipText=""
          ></UploadButton>
        )}
      </PhotoEnable>
      <ApplyButton
        onClick={setSettings}
        style={{
          height: 40,
          width: 150,
          marginTop: 150,
          marginLeft: 0,
          cursor: "pointer",
        }}
        caption="APPLY"
      ></ApplyButton>
    </AdminContent>
  );
};

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  flex-direction: row;
  justify-content: space-between;
`;

export default Admin;
