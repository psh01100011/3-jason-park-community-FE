import { loadHeader } from '../../component/header/header.js';
import { fetchPostDetail } from '../../../api/post/post.js';  
import { setWriteForm } from '../../component/writeForm/writeForm.js';
import { setRewriteContent } from '../../component/writeForm/writeForm.js';
import { checkSession } from '../../../util/session.js';
import { loadFooter } from '../../component/footer/footer.js';


document.addEventListener('DOMContentLoaded', async () =>{
    //세션 체크 위치 좀 고민해보기 -> 지금은 헤더에서도 체크 중인데, 여기서도 체크하면 중복 체크하는 중임
    // 뒤로가기 문제 -> 뒤로 가기 할 때 현재 페이지에 세션 없이도 들어와짐 -> 세션 체크가 무의미한 상황
    if(!await checkSession()){
        window.location.href = '/login';
        return
    }
    //헤더 로딩
    loadHeader();
    loadFooter();
    setWriteForm();
    //
    let postId = window.location.pathname
    postId = postId.replace('/rewrite/','');
    const postDetail = await fetchPostDetail(postId);

    setRewriteContent(postDetail);

});


// 글 작성 완료 버튼 -> 백엔드 연동
//const submitButton = document.getElementById('submitButton');

//수정으로 변경
if (submitButton) {

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        let postId = window.location.pathname
        postId = postId.replace('/rewrite/','');
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }   

        try {
            const response = await fetch(`/posts/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                }),
                credentials: 'include'
            });

            if (response.status !== 201) {
                throw new Error('글 수정 요청 실패');
            }

            // 글 작성 성공 시 메인 페이지로 이동
            window.location.href = `/post/${postId}`;

        } catch (err) {
            console.error('글 수정 중 오류 발생:', err);
            alert('글 수정에 실패했습니다. 다시 시도해주세요.');
        }
    });






}