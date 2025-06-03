import { useEffect } from 'react';
import getOrCreateClientId from './getOrCreateClientId';

function useSseNotifications(onNewNotification) {
  useEffect(() => {
    const clientId = getOrCreateClientId();
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/sse/connect?clientId=${clientId}`;
    console.log('[SSE] 연결 시도...', url);
    const eventSource = new window.EventSource(url);
    eventSource.onopen = () => {
      console.log('[SSE] 연결 성공');
    };
    eventSource.onmessage = (event) => {
      console.log('[SSE] 메시지 수신:', event.data);
      try {
        const parsed = JSON.parse(event.data);
        if (parsed && parsed.data) {
          onNewNotification({ ...parsed.data, isNew: true });
        }
      } catch (e) {
        console.log('[SSE] 메시지 파싱 에러:', e);
      }
    };
    eventSource.onerror = (err) => {
      console.log('[SSE] 에러 발생:', err);
      eventSource.close();
      // 재연결 등 필요시 추가
    };
    return () => {
      console.log('[SSE] 연결 종료');
      eventSource.close();
    };
  }, [onNewNotification]);
}

export default useSseNotifications; 