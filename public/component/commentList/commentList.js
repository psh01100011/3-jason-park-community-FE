import { getCookie } from '../../../util/cookie.js';

export function setCommentList(comments) {
  const commentListContainer = document.getElementById('comments-section');

  const userId = Number(getCookie('userId'));

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
          <input type="text" id="comment-input" value = ${comment.content} placeholder="댓글을 입력하세요"/>
          <button id="comment-submit">댓글 수정</button>
          `;

        item.appendChild(rewriteComment);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '삭제';
      deleteBtn.classList.add('comment-delete-btn');
      // 삭제 이벤트
      deleteBtn.addEventListener('click', () => {
        var msg = "";

        if(confirm("댓글을 삭제 하시겠습니까?")){
            msg = "삭제 완료";

        }else{
          msg = "취소";
        }

    alert(msg);
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