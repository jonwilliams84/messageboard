import React, { Component } from "react";
import styled, { css } from "styled-components";

function ApplyButton(props) {
  return (
    <Container {...props}>
      <Caption>{props.caption || "BUTTON"}</Caption>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: #999999;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: 2px;
  min-width: 88px;
  padding-left: 16px;
  padding-right: 16px;
  box-shadow: 0px 1px 5px  0.35px #000 ;
  cursor: 'pointer';
`;

const Caption = styled.span`
  font-family: Bebas Neue;
  color: #000000;
  font-size: 24px;
`;

export default ApplyButton;
