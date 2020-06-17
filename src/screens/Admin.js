import React, { useState, useEffect } from "react";
import Content from "../styles/Content";
import FormText from "../components/FormText";
import ColourPicker from "../components/ColourChanger";
import { useHistory } from "react-router-dom";
import AdminContent from "../styles/AdminContent";
import MessageBoardAdmin from "../styles/MessageBoardAdmin";
import FormInput from "../styles/FormInput";
import ButtonStack from "../styles/ButtonStack";
import Button from "../styles/Button";
import ButtonOverlay from "../styles/ButtonOverlay";
import ButtonSpan from "../styles/ButtonSpan";
import { ADMIN_URL as URL } from "../Constants";
import MaterialUISwitch from "@material-ui/core/Switch";
import MaterialButtonGrey from "../styles/MaterialButtonGrey";
import PhotoMode from "../styles/PhotoMode"
import PhotoEnable from "../styles/PhotoEnable"
import Switch from "../styles/PhotoEnable"

const Admin = () => {
  const [formValues, setFormValues] = useState({});
  const [backgroundColour, setBackgroundColour] = useState("#000");
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(URL, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setFormValues(JSON.parse(data.lines));
      setBackgroundColour(data.backgroundColour);
    };
    fetchData();
  }, []);

  const updateLine = (name, value) => {
    const newFormValues = { ...formValues, [name]: value };
    setFormValues(newFormValues);
  };

  const handleBackgroundColourChange = (colour) => {
    setBackgroundColour(colour.hex);
  };

  const setSettings = async () => {
    const body = {
      lines: JSON.stringify(formValues),
      backgroundColour: backgroundColour,
    };
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

  return (
    <AdminContent>
      <MessageBoardAdmin>Message Board {"\n"}Admin</MessageBoardAdmin>
      <FormInput>
        <FormText
          defaultValue={formValues.line1 ? formValues.line1 : ""}
          label="LINE 1"
          name="line1"
          onChange={updateLine}
          maxLength={15}
          backgroundColour={backgroundColour}
        ></FormText>
        <FormText
          defaultValue={formValues.line2 ? formValues.line2 : ""}
          label="LINE 2"
          name="line2"
          onChange={updateLine}
          maxLength={15}
          backgroundColour={backgroundColour}
        ></FormText>
        <FormText
          defaultValue={formValues.line3 ? formValues.line3 : ""}
          label="LINE 3"
          name="line3"
          onChange={updateLine}
          maxLength={15}
          backgroundColour={backgroundColour}
        ></FormText>
      </FormInput>
      <ColourPicker
        backgroundColour={backgroundColour}
        handleBackgroundColourChange={handleBackgroundColourChange}
      />
      <PhotoEnable>
        <PhotoMode>Photo Mode</PhotoMode>
        <Switch>
          <MaterialUISwitch
            color="primary"
            checked={true}
            style={{ color: "rgba(74,144,226,1)" }}
          ></MaterialUISwitch>
        </Switch>
        <MaterialButtonGrey
          style={{
            height: 25,
            width: 85,
            marginLeft: 13
          }}
          caption="UPLOAD"
        ></MaterialButtonGrey>
      </PhotoEnable>

      <ButtonStack>
        <Button>
          <ButtonOverlay></ButtonOverlay>
        </Button>
        <ButtonSpan onClick={setSettings}>APPLY</ButtonSpan>
      </ButtonStack>
    </AdminContent>

  );
};

export default Admin;