export async function checkSession() {
    try {
        //현재는 내정보 보기로 세션 유지 상태를 확인 -> 세션 유지 상태 확인용 api가 따로 존재하면 더 좋지 않을까?
        // -> db 탐색 문제(시간,자원)
        const response = await fetch('http://localhost:8080/api/v1/users/me', {
            method: 'GET',
            credentials: 'include' 
        });

        console.log(response.status)
        if(response.status == 200){
            return true;
        }
        else{
            return false
        }

          
    } catch (err) {
        //console.error('프로필 표시 중 오류 발생:', err);
        return false;
    }
}