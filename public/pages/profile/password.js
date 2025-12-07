import { loadHeader } from '../../component/header/header.js';
import { loadFooter } from '../../component/footer/footer.js';
import { fetchRequest } from '../../../api/auth/auth.js';
import { address } from '../../../config/config.js';

document.addEventListener('DOMContentLoaded', async () =>{
    //헤더 로딩
    loadHeader();
    loadFooter();

    // 비밀번호 입력 시 비밀번호 확인 메시지 초기화 
    const passwordInput = document.getElementById('password');
    const passwordCheckMessage = document.getElementById('password-check-message');
    const passwordMessage = document.getElementById('password-message');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            passwordCheckMessage.textContent = '';
            const passwordCheck = e.target.value;

            if(passwordCheck.length < 8){
                passwordMessage.textContent = '길이가 너무 짧습니다.';
                passwordMessage.style.color = 'red';
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]).{8,}$/;

            if (!passwordRegex.test(passwordCheck)) {
                passwordMessage.textContent = '대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.';
                passwordMessage.style.color = 'red';
                return;
            }
            passwordMessage.textContent = '안전한 비밀번호';
            passwordMessage.style.color = 'green';


        });
    }
    // 비밀번호 확인 이벤트 : debounce 적용하기
    const passwordCheckInput = document.getElementById('passwordCheck');
    if (passwordCheckInput) {
        passwordCheckInput.addEventListener('input', debounce((e) => {

            const pwValid = passwordMessage.style.color !== "green";
            if(pwValid){
                return;
            }

            const password = document.getElementById('password').value;
            const passwordCheck = e.target.value;

            if (password === passwordCheck) {
                passwordCheckMessage.textContent = '비밀번호가 일치합니다.';
                passwordCheckMessage.style.color = 'green';
            } else {
                passwordCheckMessage.textContent = '비밀번호가 일치하지 않습니다.';
                passwordCheckMessage.style.color = 'red';
            }
        }, 300));
    }


    

    // 완료 버튼 이벤트
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', async(e) => {
            e.preventDefault();
            Swal.fire({
                title: '변경 중...',
                didOpen: async () => {
                    Swal.showLoading();

                    try {
                        const password = document.getElementById('password').value;

                        const url = `${address}/api/v1/users/me/auth`; 
                        const option ={
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                password
                            }),
                            credentials: 'include'
                        };
                        const response = await fetchRequest(url, option);
                
                        if (response.status !== 204) {
                            throw new Error('수정 요청 실패');
                        }
                        Swal.fire({
                            icon: 'success',
                            title: '성공했습니다!',
                            timer: 1200,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = '/';
                        });

                    } catch (e) {
                        Swal.fire({
                            icon: 'error',
                            title: '다시 시도해주세요.',
                        });
                    }
                }
            });
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
