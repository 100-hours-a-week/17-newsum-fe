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

export default useSseNotifications; 