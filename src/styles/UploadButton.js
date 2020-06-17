import React, { Component } from "react";
import styled, { css } from "styled-components";

function UploadButton(props) {
  return (
    <Container {...props}>
      <LeftImage src={require("../assets/images/cardImage.png")}></LeftImage>
      <ChipText>{props.chipText || "Example Chip"}</ChipText>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(230,230,230);
  border-radius: 50px;
  flex-direction: row;
`;

const LeftImage = styled.img`
  height: 32px;
  width: 100%;
  background-color: #CCC;
  border-radius: 16px;
`;

const ChipText = styled.span`
  font-family: Bebas Neue;
  font-size: 12px;
  color: rgba(255,255,255,0.87);
  padding-left: 8px;
  padding-right: 12px;
`;

export default UploadButton;
