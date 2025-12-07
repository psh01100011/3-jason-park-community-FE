import { loadHeader } from '../../component/header/header.js';
import { setWriteForm } from '../../component/writeForm/writeForm.js';
import { checkSession } from '../../../util/session.js';
import { loadFooter } from '../../component/footer/footer.js';
import { fetchRequest } from '../../../api/auth/auth.js';
import { address } from '../../../config/config.js';
import { uploadImage } from '../../../api/image/image.js';
document.addEventListener('DOMContentLoaded', async () =>{
    //세션 체크 위치 좀 고민해보기 -> 지금은 헤더에서도 체크 중인데, 여기서도 체크하면 중복 체크하는 중임
    // 뒤로가기 문제 -> 뒤로 가기 할 때 현재 페이지에 세션 없이도 들어와짐 -> 세션 체크가 무의미한 상황
    const userId = sessionStorage.getItem('userId');
    if(userId == null){
        window.location.href = '/login';
        return
    }
    //헤더 로딩
    loadHeader();
    loadFooter();
    setWriteForm();
});


// 글 작성 완료 버튼 -> 백엔드 연동
const submitButton = document.getElementById('submitButton');
if (submitButton) {

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const file = document.getElementById('imageInput').files[0];
        
        if (!title || !content) {
            return;
        }   

        Swal.fire({
            title: '담벼락에 붙이는 중...',
            didOpen: async () => {
                Swal.showLoading();

                try {


                    let postImage = null;
                    if(file != null){
                    postImage = await uploadImage(file);
                    console.log(await postImage);
                    }

                    const url = `${address}/api/v1/posts`;
                    const option = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: title,
                            content: content,
                            image : postImage
                        }),
                        credentials: 'include'
                    };
                    const response = await fetchRequest(url, option);

                    if (response.status !== 201) {
                        throw new Error('글 작성 요청 실패');
                    }
                    // 글 작성 성공 시 메인 페이지로 이동
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