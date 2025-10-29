import { loadHeader } from '../../component/header/header.js';
import { loadFooter } from '../../component/footer/footer.js';


document.addEventListener('DOMContentLoaded', async () =>{
    //헤더 로딩
    loadHeader();
    loadFooter();

    // 닉네임 중복 확인 이벤트 : debounce 적용하기
    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) {
        nicknameInput.addEventListener('input', debounce(async(e) => {
            const nickname = e.target.value;

            // 중복 확인 API 호출 : 로그인과 닉네임 체크에서 중복 사용 중
            try {
                const response = await fetch('http://localhost:8080/api/v1/users/nickname', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nickname
                    })
                });
                const message = document.getElementById('nickname-message');
                if(await response.json()){
                    message.textContent = '사용 가능한 닉네임입니다.';
                    message.style.color = 'green';
                }
                else{
                    message.textContent = '이미 사용 중인 닉네임입니다.';
                    message.style.color = 'red';
                }
        

            } catch (err) {
                console.error('검증 오류 :', err);
            }

        }, 300));
    }


    

    // 완료 버튼 이벤트
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', async(e) => {
            e.preventDefault();
            
            const nickname = document.getElementById('nickname').value;
            try {
                const response = await fetch('http://localhost:8080/api/v1/users/me', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nickname
                    }),
                    credentials: 'include'
                });
                
                if (response.status !== 204) {
                    throw new Error('수정 요청 실패');
                }
                alert('내 정보가 변경되었습니다.');
                window.location.href = '/';

            } catch (err) {
                console.error('내 정보 수정 중 오류 발생:', err);
                alert('내 정보 수정에 실패했습니다. 다시 시도해주세요.');
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
