import { loadHeader } from '../../component/header/header.js';
import { loadFooter } from '../../component/footer/footer.js';
import { checkSession } from '../../../util/session.js';
import { address } from '../../../config/config.js';

document.addEventListener('DOMContentLoaded', async () =>{
    //헤더 로딩
    loadHeader();
    loadFooter();
    const isLogin = await checkSession();
    if(await isLogin){
       window.location.href = '/';
    }

    // 회원가입 버튼 이벤트
    const signUpButton = document.getElementById('registButton');
    if (signUpButton) {
        signUpButton.addEventListener('click', (e) => {
        e.preventDefault(); // form submit 방지
        window.location.href = '/regist'; // 이동할 회원가입 페이지 경로
        });
    }

    // 로그인 버튼 이벤트
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click',async (e) => {
            e.preventDefault();
            console.log('로그인 버튼 클릭됨'); 
            // input 값 가져오기
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (!email || !password) {
                return;
            }   
            try {
                const url = `${address}/api/v1/auth`;
                const option = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    credentials: 'include'
                }
                const response = await fetch(url, option);
                
                if (response.status !== 201) {
                    throw new Error('로그인 요청 실패');
                }
                const userId = await response.text();
                sessionStorage.setItem("userId", userId);
                window.location.href = '/';
        

            } catch (err) {
                console.error('로그인 중 오류 발생:', err);
                await Swal.fire({
                    icon: 'error',
                    title: '로그인 실패!',
                    showConfirmButton: false,
                    timer: 1200
                });
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            }
        });
    }
        
});



