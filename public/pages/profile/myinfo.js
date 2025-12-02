import { loadHeader } from '../../component/header/header.js';
import { loadFooter } from '../../component/footer/footer.js';
import { fetchRequest } from '../../../api/auth/auth.js';
import { address } from '../../../config/config.js';
import { setProfile } from '../../component/image/profile.js';
import { uploadImage } from '../../../api/image/image.js';


document.addEventListener('DOMContentLoaded', async () =>{
    //헤더 로딩
    loadHeader();
    loadFooter();

    const url = `${address}/api/v1/users/me`;
    const option = {
        method: 'GET',
        credentials: 'include' 
    };
    const result = await fetchRequest(url, option);
    if(result == null){
        alert('로그인이 필요합니다.');
        window.location.href = '/';
    }
    const user = await result.json()
    
    setProfile(user.profileImage);
    // 닉네임 중복 확인 이벤트 : debounce 적용하기
    const nicknameInput = document.getElementById('nickname');
    nicknameInput.value = user.nickname;
    console.log(user.nickname);
    if (nicknameInput) {
        nicknameInput.addEventListener('input', debounce(async(e) => {
            const nickname = e.target.value;

            // 중복 확인 API 호출 : 로그인과 닉네임 체크에서 중복 사용 중
            try {
                const response = await fetch(`${address}api/v1/users/nickname`, {
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
            

            const profile = document.getElementById('profile');
            const file = document.getElementById('fileInput').files[0];
            console.log(profile);
            let profileImage = null;
            if(!profile.src.includes('basic.jpg')){
                try {
                    profileImage = await uploadImage(file);
                    console.log(await profileImage);
                    
                }
                catch (err){
                    console.error('사진 등록 중 오류 발생:', err);
                    alert('내 정보 수정에 실패했습니다. 다시 시도해주세요.');
                    return;
                }
            }

            const nickname = document.getElementById('nickname').value;
            try {
                const url = `${address}/api/v1/users/me`;
                const option = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        profileImage,
                        nickname
                    }),
                    credentials: 'include'
                };
                const response = await fetchRequest(url, option);

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
