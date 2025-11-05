import { address } from '../../config/config.js';

//중복 호출 제어 lock처럼 사용
let isRefreshing = false;
let refreshPromise = null;


export async function fetchRequest(url, options = {}) {

    console.log(url +" : 1차요청");
    let response = await fetch(url ,options);
    if (response.status === 403 || response.status === 401){
        console.log("토큰 만료 재발급 요청");
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = fetch(`${address}/api/v1/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            })
            .then(res => {
                if (!res.ok) throw new Error('Refresh failed');
                return res;
            })
            .finally(() => {
                isRefreshing = false;
            });
        }


        try {
            await refreshPromise;
            console.log(url +" : 2차요청");
            response = await fetch(url ,options);
        } catch(err){
            console.error('Failed to refresh token.', err);
            window.location.href = '/login';
            return null;
        }
    }
    if (!response.ok) throw new Error(`요청 실패: ${response.status}`);
    return response;
}
