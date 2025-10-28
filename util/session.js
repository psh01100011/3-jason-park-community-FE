export async function checkSession() {
    try {
        const response = await fetch('/users/me', {
            method: 'GET'
        });

        console.log(response.status)
        if(response.status == 200){
            return true;
        }
        else{
            return false
        }

          
    } catch (err) {
        console.error('프로필 표시 중 오류 발생:', err);
        return false;
    }
}