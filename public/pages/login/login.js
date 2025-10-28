import { loadHeader } from '../../component/header/header.js';
import { loadFooter } from '../../component/footer/footer.js';

document.addEventListener('DOMContentLoaded', async () =>{
    //헤더 로딩
    loadHeader();
    loadFooter();

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
            
            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                    credentials: 'include'
                });  

                if (response.status !== 200) {
                    throw new Error('로그인 요청 실패');
                }
                window.location.href = '/';
        

            } catch (err) {
                console.error('로그인 중 오류 발생:', err);
                alert('아이디 또는 비밀번호가 잘못되었습니다.');

                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            }
    
            
            
        });
    }
        
});



