import { loadHeader } from '../../component/header/header.js';
import { fetchPostDetail } from '../../../api/post/post.js';  
import { setPostDetail } from '../../component/postDetail/postDetail.js';
import { setCommentList } from '../../component/commentList/commentList.js';
import { fetchComments } from '../../../api/comment/comment.js';  
import { loadFooter } from '../../component/footer/footer.js';




document.addEventListener('DOMContentLoaded', async () =>{
    
    //헤더 로딩
    loadHeader();
    loadFooter();
    //세션 확인


    // 게시물 내용 채우기
    try{
        //게시물 상세 내용 조회
        let postId = window.location.pathname


        postId = postId.replace('/post/','');
        const postDetail = await fetchPostDetail(postId);
        console.log('작성자 id', postDetail.userId);
       // 내용 채우기
       setPostDetail(postDetail);

       //댓글 상세 내용 조회
       let comments = await fetchComments(postId);
       // 댓글 채우기
        setCommentList(comments);



        const commentButton = document.getElementById('comment-submit')
        commentButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const comment = document.getElementById('comment-input').value;
            if (!comment) {
                return;
            }   

            try {
                const response = await fetch(`/api/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: comment
                    }),
                    credentials: 'include'
                });

                if (response.status !== 201) {
                    throw new Error('댓글 작성 요청 실패');
                }

                // 댓글 작성 시 리스트 초기화
                location.href = location.href;

            } catch (err) {
                console.error('댓글 작성 중 오류 발생:', err);
                alert('글 작성에 실패했습니다. 다시 시도해주세요.');
            }
    });







    }catch(err){
        console.error('게시물 로딩 중 오류 발생:', err);
        document.getElementById('post-list').innerHTML = '<p>게시물을 불러오는 중 오류가 발생했습니다.</p>';
    }
});