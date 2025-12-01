import { getCookie } from '../../../util/cookie.js';
import { address } from '../../../config/config.js';
import { fetchRequest } from '../../../api/auth/auth.js';

let targetComment = null; //삭제 대상
export function setCommentList(comments) {
  const commentListContainer = document.getElementById('comments-section');
  const userId = parseFloat(sessionStorage.getItem("userId"));

  const modal = document.getElementById('comment-modal');
  const confirmBtn = document.getElementById('confirmDeleteComment');
  const cancelBtn = document.getElementById('cancelDeleteComment');

  // 취소
  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    targetComment = null;
  });

  // 삭제
  confirmBtn.addEventListener('click', async () => {
    if (!targetComment) return;

    try {
      const url = `${address}/api/v1/posts/${targetComment.postId}/comments/${targetComment.id}`;
      const option = {
        method: 'DELETE',
        credentials: 'include'
      };

      const response = await fetchRequest(url, option);

      if (!response.ok) {
        alert('삭제 실패');
        return;
      }

      alert('삭제되었습니다.');
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert('에러가 발생했습니다.');
    } finally {
      modal.classList.remove('show');
      targetComment = null;
    }
  });


  comments.forEach(comment => {
    const item = document.createElement('div');
    item.classList.add('comment-item');

    // 댓글 메타 정보
    const meta = document.createElement('div');
    meta.classList.add('comment-meta');

    // 왼쪽 영역 (작성자 + 날짜)
    const metaLeft = document.createElement('div');
    metaLeft.classList.add('comment-meta-left');
    metaLeft.innerHTML = `
      <span class="comment-nickname">${comment.nickname}</span>
      <span class="comment-date">${new Date(comment.createdAt).toLocaleString()}</span>
    `;

    meta.appendChild(metaLeft);

    // 내용
    const content = document.createElement('div');
    content.classList.add('comment-content');
    content.textContent = comment.content;

    // 수정 삭제
    if (userId === comment.userId) {
      const actions = document.createElement('div');
      actions.classList.add('comment-actions');

      const editBtn = document.createElement('button');
      editBtn.textContent = '수정';
      editBtn.classList.add('comment-edit-btn');
      // 수정 이벤트
      editBtn.addEventListener('click', () => {
        const rewriteComment = document.createElement('div');
          rewriteComment.classList.add("comment-write");
          rewriteComment.innerHTML= `
            <input type="text" class="comment-edit-input" value="${comment.content}" />
            <button class="comment-edit-submit">수정 완료</button>
            <button class="comment-edit-cancel">취소</button>
            `;

        item.appendChild(rewriteComment);

        const inputEl = rewriteComment.querySelector('.comment-edit-input');
        const submitEl = rewriteComment.querySelector('.comment-edit-submit');
        const cancelEl = rewriteComment.querySelector('.comment-edit-cancel');

        // 수정 완료 버튼 → API 호출
        submitEl.addEventListener('click', async () => {
          const newContent = inputEl.value.trim();

          if (newContent.length === 0) {
            alert('댓글 내용을 입력해주세요.');
            return;
          }

          try {
            const url = `${address}/api/v1/posts/${comment.postId}/comments/${comment.id}`;
            const option = {
              method: 'PATCH',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ content: newContent })
            };

            const response = await fetchRequest(url, option);

            if (!response.ok) {
              alert('댓글 수정 실패');
              return;
            }

            alert('댓글이 수정되었습니다.');
            window.location.reload();

          } catch (error) {
            console.error(error);
            alert('에러가 발생했습니다.');
          }
        });

        // 취소 버튼 → 수정창 제거
        cancelEl.addEventListener('click', () => {
          rewriteComment.remove();
        });



      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '삭제';
      deleteBtn.classList.add('comment-delete-btn');
      // 삭제 이벤트
      deleteBtn.addEventListener('click', () => {
        targetComment = comment; // ★ 어떤 댓글을 삭제할지 저장
        modal.classList.add('show');
      });
      

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      meta.appendChild(actions);
    }

    item.appendChild(meta);
    item.appendChild(content);
    commentListContainer.appendChild(item);
  });


}