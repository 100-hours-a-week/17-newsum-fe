// src/components/Layout/NoHeaderLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import BottomNav from './BottomNav';
import styled from '@emotion/styled';

const MainContainer = styled(Box)`
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  position: relative;
  border-radius: 24px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: white;
  overflow: hidden;

  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  @media (max-width: 767px) {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
`;

const ContentBox = styled(Box)`
  flex-grow: 1;
  padding: 0px;
  margin-top: 10px;

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0px;
  }
`;

function NoHeaderLayout() {
  return (
    <MainContainer>
      <ContentBox component="main">
        <Outlet />
      </ContentBox>
      <BottomNav />
    </MainContainer>
  );
}

export default NoHeaderLayout;