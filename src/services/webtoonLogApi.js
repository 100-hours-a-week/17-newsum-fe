import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';
import getOrCreateClientId from '../utils/getOrCreateClientId';

export const logWebtoonView = async (webtoonId, isLoggedIn) => {
    const url = `/api/v1/webtoons/${webtoonId}/logs`;
    try {
        if (isLoggedIn) {
            await TokenAxios.post(url, {});
        } else {
            const clientId = getOrCreateClientId();
            await DefaultAxios.post(url, { clientId });
        }
    } catch (e) {
        // 로그 저장 실패 시 에러 무시
    }
}; 