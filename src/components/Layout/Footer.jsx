import React from 'react';
import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';
import KAKAO_LOGO from '../../assets/kakao_logo.png';
import INSTAGRAM_LOGO from '../../assets/insta_logo.png';
import NEWSUM_LOGO from '../../assets/logo.png';


const FooterContainer = styled(Box)`
  padding: 32px 0;  
  background-color: white;
  border-top: 1px solid #eee;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Logo = styled.img`
  height: 50px;
  width: auto;
  object-fit: contain;
`;

const CompanyInfo = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const PolicySection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const PolicyButton = styled(Button)`
  color: #666;
  padding: 0;
  min-width: auto;
  font-size: 14px;

  &:hover {
    background: none;
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <LogoSection>
          <Logo src={NEWSUM_LOGO} alt="NewSum Logo" />
        </LogoSection>

        <CompanyInfo>
          <div>상호 : (주) 뉴썸 | 대표자 : rok.lee</div>
          <div>주소 : 경기 성남시 분당구 대왕판교로 660 유스페이스1 A동 405호</div>
          <div>전화번호 : 010-1234-5678</div>
          <div>이메일 : qwert1234@kakao.com</div>
        </CompanyInfo>

        <PolicySection>
          <PolicyButton>이용약관</PolicyButton>
          <PolicyButton>개인정보처리방침</PolicyButton>
        </PolicySection>

        <Copyright>©NewSum. All rights reserved.</Copyright>

        <SocialLinks>
          <SocialIcon src={INSTAGRAM_LOGO} alt="Instagram" />
          <SocialIcon src={KAKAO_LOGO} alt="Kakao" />
        </SocialLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 