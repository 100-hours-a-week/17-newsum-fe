/**
 * dateFormat.jsx - 날짜 포맷팅 관련 유틸리티 함수를 제공합니다.
 */

/**
 * 날짜를 YYYY년 MM월 DD일 형식으로 포맷팅합니다.
 * 
 * @param {string|Date} dateString - 포맷팅할 날짜 (ISO 문자열 또는 Date 객체)
 * @returns {string} - 포맷팅된 날짜 문자열
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅합니다.
 * 
 * @param {string|Date} dateString - 포맷팅할 날짜 (ISO 문자열 또는 Date 객체)
 * @returns {string} - 포맷팅된 날짜 문자열
 */
export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
};

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅하고 "기준"이라는 텍스트를 붙입니다.
 * 
 * @param {string|Date} dateString - 포맷팅할 날짜 (ISO 문자열 또는 Date 객체)
 * @returns {string} - 포맷팅된 날짜 문자열
 */
export const formatDateWithReference = (dateString) => {
  if (!dateString) return '';
  
  return `${formatShortDate(dateString)} 기준`;
}; 