import { useEffect } from 'react';
import getOrCreateClientId from './getOrCreateClientId';

function useSseNotifications(onNewNotification, onConnect) {
  useEffect(() => {
    const clientId = getOrCreateClientId();
    const token = localStorage.getItem('accessToken');
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/sse/connect?clientId=${clientId}&accessToken=${token}`;
    const eventSource = new window.EventSource(url);

    // 연결 성공 이벤트
    eventSource.addEventListener('connect', (event) => {
      if (onConnect) onConnect(event.data);
    });

    // 실제 알림 데이터 이벤트
    eventSource.addEventListener('data', (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed) {
          onNewNotification({ ...parsed, isNew: true });
        }
      } catch (e) {
        console.log('[SSE] 메시지 파싱 에러:', e);
      }
    });

    eventSource.onerror = (err) => {
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, [onNewNotification, onConnect]);
}

// 웹툰 실시간 시청자 수 SSE 연결 함수
export function connectWebtoonSSE(webtoonId, clientId, onViewerCount) {
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/sse/webtoon/connect?webtoonId=${webtoonId}&clientId=${clientId}`;
  const eventSource = new window.EventSource(url);

  eventSource.addEventListener('viewer-count', (event) => {
    // "viewerCount: 1" 형태로 오므로 파싱
    const count = Number(event.data.replace('viewerCount: ', ''));
    onViewerCount(count);
  });

  eventSource.onerror = (err) => {
    eventSource.close();
  };
  return eventSource;
}

export default useSseNotifications; 