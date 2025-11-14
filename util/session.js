import { fetchRequest } from '../../../api/auth/auth.js';
import { address } from '../../../config/config.js';

export async function checkSession() {
    let refreshPromise = fetch(`${address}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(res => {
        if (!res.ok) throw new Error('Refresh failed');
        return res;
    })
    //로그인, 글쓰기 등등 로그인 없이 접근할 경우 불편함을 초래할 수 있는 페이지에서 세션 체크 진행
    try {
        await refreshPromise;
        //현재는 내정보 보기로 세션 유지 상태를 확인 -> 세션 유지 상태 확인용 api가 따로 존재하면 더 좋지 않을까?
        // -> db 탐색 문제(시간,자원)
        const url = `${address}/api/v1/users/me`;
        const option = {
            method: 'GET',
            credentials: 'include' 
        };
        const response = await fetch(url,option);

        console.log(response.status)
        if(response.status == 200){
            const res = await response.json();
            const userId = res.id;
            
            sessionStorage.setItem('userId', userId);
            return true;
        }
        else{
            sessionStorage.removeItem('userId');
            return false
        }

          
    } catch (err) {
        console.log("세션 체크 중 오류 발생");
        return false;
    }
}