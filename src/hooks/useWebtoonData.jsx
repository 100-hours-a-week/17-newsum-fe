import { useState, useEffect } from 'react';
import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';
import { useNotificationStore } from '../store/notificationStore';
import { useAuth } from '../contexts/AuthContext';

/**
 * 웹툰 데이터를 가져오는 커스텀 훅
 * 
 * @returns {Object} - 웹툰 데이터 및 관련 상태
 */
const useWebtoonData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webtoonsData, setWebtoonsData] = useState({});
  const [top3Data, setTop3Data] = useState({});
  const [recentData, setRecentData] = useState({});
  const setHasNewNotification = useNotificationStore((state) => state.setHasNewNotification);
  const { isLoggedIn } = useAuth();

  // 카테고리별 웹툰 데이터 가져오기
  const getWebtoons = async () => {
    try {
      const res = await DefaultAxios.get('/api/v1/webtoons/main');
      console.log(res.data?.data);
      setWebtoonsData(res.data?.data || {});
    } catch (err) {
      console.log(err);
      setError(err.message || '카테고리별 웹툰을 불러오는 중 오류가 발생했습니다.');
    }
  };
  
  // 상위 3개 웹툰 및 오늘의 뉴스 데이터 가져오기
  const getTop3Data = async () => {
    try {
      // 로그인 상태에 따라 적절한 axios 인스턴스 선택
      const axiosInstance = isLoggedIn ? TokenAxios : DefaultAxios;
      const res = await axiosInstance.get('/api/v1/webtoons/top');
      console.log(res.data);
      setTop3Data(res.data?.data || {});
      // hasNewNotification 값을 store에 저장
      setHasNewNotification(res.data?.data?.hasNewNotification || false);
    } catch (err) {
      console.log(err);
      setError(err.message || '상위 웹툰을 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 최근 본 웹툰 데이터 가져오기
  const getRecentData = async () => {
    try {
      const res = await TokenAxios.get('/api/v1/webtoons/recent');
      console.log(res.data);
      setRecentData(res.data?.data || {});
    } catch (err) {
      console.log(err);
      // 최근 본 웹툰은 로그인이 필요할 수 있으므로 오류 메시지를 설정하지 않음
    }
  };

  // 데이터 새로고침
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([getWebtoons(), getTop3Data(), getRecentData()]);
    } catch (err) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    refreshData();
  }, [isLoggedIn]); // isLoggedIn이 변경될 때마다 데이터 새로고침

  return {
    loading,
    error,
    webtoonsData,
    top3Data,
    recentData,
    refreshData
  };
};

export default useWebtoonData; 