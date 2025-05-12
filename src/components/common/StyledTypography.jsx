import React from 'react';
import { Typography, Box } from '@mui/material';
import styled from '@emotion/styled';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

/**
 * 조회수, 댓글수 등을 표시하는 텍스트 컴포넌트
 */
export const CountText = styled(Typography)`
  color: ${props => props.theme?.palette?.text?.secondary || 'rgba(0, 0, 0, 0.6)'};
  font-size: 0.75rem;
`;

/**
 * 제목이나 헤더를 표시하는 컴포넌트
 */
export const HeaderText = styled(Typography)`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * 카드 내 타이틀을 표시하는 컴포넌트
 */
export const CardTitle = styled(Typography)`
  font-weight: bold;
  font-size: 0.9rem;
  line-height: 1.2;
  margin-bottom: 4px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${props => props.lines || 2};
  word-break: keep-all;
`;

/**
 * 작은 크기의 카운트 표시용 컴포넌트
 */
export const SmallCount = styled(Typography)`
  font-size: 0.75rem;
  color: ${props => props.color || 'inherit'};
`;

/**
 * 아이콘을 포함한 카운트 텍스트 컴포넌트
 */
const IconCountWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CountValue = styled(Typography)`
  color: ${props => props.color || 'inherit'};
  font-size: ${props => props.fontSize || '0.75rem'};
`;

/**
 * 아이콘이 포함된 카운트 컴포넌트
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - 표시할 아이콘
 * @param {string|number} props.count - 표시할 카운트 값
 * @param {string} props.label - 카운트 뒤에 표시할 레이블 (예: '명', '개')
 * @param {string} props.color - 텍스트 색상
 * @param {string} props.fontSize - 폰트 크기
 * @param {Object} props.sx - 추가 스타일
 * @param {string} props.variant - Typography 변형
 */
export const IconCount = ({ 
  icon, 
  count, 
  label = '', 
  color, 
  fontSize, 
  sx, 
  variant = 'body2' 
}) => {
  return (
    <IconCountWrapper sx={sx}>
      <IconContainer>
        {icon}
      </IconContainer>
      <CountValue color={color} fontSize={fontSize} variant={variant}>
        {count}{label}
      </CountValue>
    </IconCountWrapper>
  );
};

/**
 * 조회수 카운트 컴포넌트
 */
export const ViewCount = props => (
  <IconCount 
    icon={<VisibilityIcon sx={{ fontSize: '0.9rem', opacity: 0.7 }} />} 
    {...props} 
  />
);

/**
 * 댓글수 카운트 컴포넌트
 */
export const CommentCount = props => (
  <IconCount 
    icon={<ChatBubbleOutlineIcon sx={{ fontSize: '0.9rem', opacity: 0.7 }} />} 
    {...props} 
  />
);

export default {
  CountText,
  HeaderText,
  CardTitle,
  SmallCount,
  IconCount,
  ViewCount,
  CommentCount
}; 