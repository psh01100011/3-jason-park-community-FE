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
    if(user.profileImage == null){
        const basicButton = document.getElementById('basicButton');
        //basicButton.hidden = true;
    }
    setProfile(user.profileImage);

    const userEmail = document.getElementById('email');
    userEmail.textContent= user.email;


    // 닉네임 중복 확인 이벤트 : debounce 적용하기
    const nicknameInput = document.getElementById('nickname');
    nicknameInput.placeholder = user.nickname;
    console.log(user.nickname);
    if (nicknameInput) {
        nicknameInput.addEventListener('input', debounce(async(e) => {
            const nickname = e.target.value;
            const message = document.getElementById('nickname-message');
            if(nickname.length == 0){
                message.textContent = '';
                message.style.color = 'green';
                return;
            }
            if(nickname.length < 2){
                message.textContent = '길이가 너무 짧습니다.';
                message.style.color = 'red';
                return;
            }

            // 중복 확인 API 호출 : 로그인과 닉네임 체크에서 중복 사용 중
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
    

    // 완료 버튼 이벤트
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', async(e) => {
            e.preventDefault();
            const vaild = document.getElementById('nickname-message').style.color ==='red'
            
            if(vaild){
                return;
            }

            Swal.fire({
                title: '담벼락에 붙이는 중...',
                didOpen: async () => {
                    Swal.showLoading();

                    try {

                        const updateBody = {};

                        //닉네임 변경 체크
                        const nicknameInput = document.getElementById('nickname').value;
                        //변경이 있으면 요청에 추가
                        if(nicknameInput.length != 0){
                            updateBody.nickname = nicknameInput;
                        }
            
                        //이미지 체크
                        const profile = document.getElementById('profile');
                        const file = document.getElementById('fileInput').files[0];
                        let profileImage = null;
                        if(!profile.src.endsWith(user.profileImage)){
                            if(file != null){

                                profileImage = await uploadImage(file);
                                console.log(await profileImage);
                                updateBody.profileImage = profileImage;
                            }
                        }
                        else{
                            profileImage = '/basic.jpg';
                            updateBody.profileImage = profileImage;
                        }



                        if (Object.keys(updateBody).length === 0) {
                            window.location.href = '/';
                            return;
                        }


                        const url = `${address}/api/v1/users/me`;
                        const option = {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(
                                updateBody
                            ),
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
                            location.replace('/');
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



    const withdrawButton = document.getElementById('withdrawUser');
    withdrawButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('삭제 버튼 클릭됨');
        const modal = document.querySelector('.modal');
        modal.classList.add('show');
    });

    // 모달 관련 요소들
    const modal = document.getElementById('withdraw-modal');
    const confirmBtn = document.getElementById('confirmWithdraw');
    const cancelBtn = document.getElementById('cancelWithdraw');

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });




    if (confirmBtn) {
        confirmBtn.addEventListener('click', async(e) => {
            e.preventDefault();
            try {
                const url = `${address}/api/v1/users/me/status`;
                const option = {
                    method: 'PATCH',
                    credentials: 'include' 
                };
                const response = await fetchRequest(url,option);

                if (response.status !== 204) {
                    throw new Error('수정 요청 실패');
                }
                alert('탈퇴되었습니다.');
                sessionStorage.removeItem("userId");
                window.location.href = '/';


            } catch(err){
                console.error('탈퇴 중 오류 발생:', err);
                alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
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
