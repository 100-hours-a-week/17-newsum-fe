/**
 * numberFormat.jsx - 숫자 포맷팅 관련 유틸리티 함수를 제공합니다.
 */

/**
 * 숫자를 한국어 단위로 포맷팅합니다.
 * - 1000 미만: 그대로 표시 (예: 123)
 * - 1000 이상 10000 미만: 천 단위 (예: 1.2천)
 * - 10000 이상: 만 단위 (예: 1.5만)
 * 
 * @param {number} number - 포맷팅할 숫자
 * @param {number} [digits=1] - 소수점 자릿수
 * @returns {string} - 포맷팅된 문자열
 */
export const formatNumber = (number, digits = 1) => {
  if (number === undefined || number === null) return "0";
  
  // 1만 이상인 경우
  if (number >= 10000) {
    const formatted = (number / 10000).toFixed(digits);
    // 소수점이 .0으로 끝나면 제거
    return formatted.endsWith(`.${Array(digits + 1).join('0')}`) 
      ? `${parseInt(formatted)}만` 
      : `${formatted}만`;
  }
  
  // 1천 이상 1만 미만인 경우
  if (number >= 1000) {
    const formatted = (number / 1000).toFixed(digits);
    return formatted.endsWith(`.${Array(digits + 1).join('0')}`) 
      ? `${parseInt(formatted)}천` 
      : `${formatted}천`;
  }
  
  // 1000 미만인 경우는 그대로 표시
  return number.toString();
};

/**
 * 조회수를 포맷팅합니다.
 * 
 * @param {number} viewCount - 조회수
 * @returns {string} - 포맷팅된 조회수 문자열
 */
export const formatViewCount = (viewCount) => {
  return formatNumber(viewCount);
}; 