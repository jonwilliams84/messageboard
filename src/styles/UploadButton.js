import React, { Component } from "react";
import styled, { css } from "styled-components";
import ImageUploading from "react-images-uploading";
import { ADMIN_URL } from '../Constants';

function UploadButton(props) {
  const onChange = (imageList) => {
    props.imageChange(imageList);
  };
  const renderImage = () => {
    if (props.photoMode) {
      if (props.image) {
        return <LeftImage src={props.image}></LeftImage>;
      } else {
        return <LeftImage src={`${ADMIN_URL}/image`}></LeftImage>;
      }
    } else {
      return (
        <LeftImage src={require("../assets/images/cardImage.png")}></LeftImage>
      );
    }
  };
  return (
    <ImageUploading onChange={onChange} acceptType={["jpg", "gif", "png"]}>
      {({ onImageUpload }) => (
        <Container onClick={onImageUpload} {...props}>
          {renderImage()}
          <ChipText>{props.chipText || ""}</ChipText>
        </Container>
      )}
    </ImageUploading>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(230, 230, 230);
  border-radius: 50px;
  flex-direction: row;
  cursor: pointer;
`;

const LeftImage = styled.img`
  height: 60px;
  width: 100%;
  background-color: #ccc;
  border-radius: 16px;
`;

const ChipText = styled.span`
  font-family: Bebas Neue;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.87);
  padding-left: 8px;
  padding-right: 12px;
`;

export default UploadButton;
