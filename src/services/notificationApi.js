import TokenAxios from '../api/TokenAxios';

export async function fetchNotifications({ cursor = '', size = 10 }) {
  const params = {};
  if (cursor) params.cursor = cursor;
  params.size = size;
  const res = await TokenAxios.get('/api/v1/users/notifications', { params });
  const { notifications, pageInfo } = res.data.data;
  return {
    data: notifications,
    nextCursor: pageInfo.nextCursor,
    hasMore: pageInfo.hasNext,
  };
}

export async function deleteAllNotifications() {
  return TokenAxios.delete('/api/v1/users/notifications');
}

export async function deleteNotification(id) {
  return TokenAxios.delete(`/api/v1/users/notifications/${id}`);
}

export async function readNotification(id) {
  return TokenAxios.patch(`/api/v1/users/notifications/${id}/read`);
} 