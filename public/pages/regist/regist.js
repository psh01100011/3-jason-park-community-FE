import { loadHeader } from '../../component/header/header.js';
import { loadFooter } from '../../component/footer/footer.js';
import { setProfile } from '../../component/image/profile.js';
import { uploadImage } from '../../../api/image/image.js';
import { address } from '../../../config/config.js';

document.addEventListener('DOMContentLoaded', async () =>{
    //헤더 로딩
    loadHeader();
    loadFooter();
    setProfile(null);

    // 로그인하러 가기 이벤트
    const gotoLoginButton  = document.getElementById('gotoLoginButton');
    if (gotoLoginButton) {
        gotoLoginButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/login';
        });
    }

    let check_email =false;
    let check_password =false;
    let check_passwordCheck =false;
    let check_nickname =false;



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



    // 이메일 중복 확인 이벤트 : debounce 적용하기
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', debounce(async(e) => {
            const email = e.target.value;
            const emailCheck = email.trim();

            const message = document.getElementById('email-message');
            //형식 검증 ()
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailCheck)) {
                message.textContent = "올바른 이메일 형식이 아닙니다.";
                message.style.color = "red";
                return;
            }       


            // 중복 확인 API 호출 구현 필요
            try {
                const response = await fetch(`${address}/api/v1/users/email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email
                    })
                });
                const result = await response.json();
                console.log(result);
                if(result){
                    message.textContent = '사용 가능한 이메일입니다.';
                    message.style.color = 'green';
                }
                else{
                    message.textContent = '이미 사용 중인 이메일입니다.';
                    message.style.color = 'red';
                }
        

            } catch (err) {
                console.error('검증 오류 :', err);
            }

        }, 300));
    }
    // 닉네임 중복 확인 이벤트 : debounce 적용하기
    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) {
        const message = document.getElementById('nickname-message');
        nicknameInput.addEventListener('input', debounce(async(e) => {
            const nickname = e.target.value;
            if(nickname.length < 2){
                message.textContent = '길이가 너무 짧습니다.';
                message.style.color = 'red';
                return;
            }

            



            // 중복 확인 API 호출 구현 필요
            try {
                const response = await fetch(`${address}/api/v1/users/nickname`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nickname
                    })
                });
                const result = await response.json();
                console.log(result);
                if(result){
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

        // 기본 이미지 설정 버튼
    const basicButton = document.getElementById('basicButton');
    if(basicButton){
        basicButton.addEventListener('click', (e) => {
            e.preventDefault();
            const profile = document.getElementById('profile');
            profile.src = '/basic.jpg';

            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileInput.value = '';           // 선택했던 파일도 초기화 (선택 해제)
            }
        });
    }

    // 회원가입 버튼 이벤트
    const registButton = document.getElementById('registButton');
    if (registButton) {
        registButton.addEventListener('click', async(e) => {
            e.preventDefault();

            const emailValid = document.getElementById('email-message').style.color !== "green";
            const nicknameValid = document.getElementById('nickname-message').style.color !== "green";
            const pwValid = document.getElementById('password-message').style.color !== "green";
            const pwCheckValid = document.getElementById('password-check-message').style.color !== "green";

            if (emailValid || nicknameValid || pwValid || pwCheckValid) {
                return;
            }


            const profile = document.getElementById('profile');
            const file = document.getElementById('fileInput').files[0];
            console.log(profile);
            let profileImage = '/basic.jpg';
            if(!profile.src.includes('basic.jpg')){
                try {
                    profileImage = await uploadImage(file);
                    console.log(await profileImage);
                    
                }
                catch (err){
                    console.error('사진 등록 중 오류 발생:', err);
                    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                    return;
                }
            }
            const email = document.getElementById('email').value;
            const nickname = document.getElementById('nickname').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch(`${address}/api/v1/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        profileImage,
                        nickname,
                        email,
                        password
                    })
                });
                
                if (response.status !== 201) {
                    throw new Error('회원가입 요청 실패');
                }
                alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                window.location.href = '/login';

            } catch (err) {
                console.error('회원가입 중 오류 발생:', err);
                alert('회원가입에 실패했습니다. 다시 시도해주세요.');
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
