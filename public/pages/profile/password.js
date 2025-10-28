import { loadHeader } from '../../component/header/header.js';
import { loadFooter } from '../../component/footer/footer.js';


document.addEventListener('DOMContentLoaded', async () =>{
    //헤더 로딩
    loadHeader();
    loadFooter();

    // 비밀번호 입력 시 비밀번호 확인 메시지 초기화 
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const passwordMessage = document.getElementById('password-message');
            passwordMessage.textContent = '';
        });
    }
    // 비밀번호 확인 이벤트 : debounce 적용하기
    const passwordCheckInput = document.getElementById('passwordCheck');
    if (passwordCheckInput) {
        passwordCheckInput.addEventListener('input', debounce((e) => {
            const password = document.getElementById('password').value;
            const passwordCheck = e.target.value;

            const passwordMessage = document.getElementById('password-message');

            if (password === passwordCheck) {
                passwordMessage.textContent = '비밀번호가 일치합니다.';
                passwordMessage.style.color = 'green';
            } else {
                passwordMessage.textContent = '비밀번호가 일치하지 않습니다.';
                passwordMessage.style.color = 'red';
            }
        }, 300));
    }


    

    // 완료 버튼 이벤트
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', async(e) => {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            try {
                const response = await fetch('/auth/me', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password
                    })
                });
                
                if (response.status !== 200) {
                    throw new Error('수정 요청 실패');
                }
                alert('비밀번호가 변경되었습니다.');
                window.location.href = '/';

            } catch (err) {
                console.error('비밀번호 수정 중 오류 발생:', err);
                alert('비밀번호 수정에 실패했습니다. 다시 시도해주세요.');
            }
        });
    }
       
    
    // debounce function
    function debounce(func, delay) {
        let timer;
        return function() {
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        }
    }

});
