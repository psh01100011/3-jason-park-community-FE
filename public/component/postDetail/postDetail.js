import { getCookie } from '../../../util/cookie.js';

export function setPostDetail(postDetail) {
  const postDetailContainer = document.getElementById('post-detail-container');

  const userId = getCookie('userId');
  const authorId = postDetail.userId;
  const container = document.getElementById('post-detail-container');
  container.innerHTML = '';

  // 📝 제목
  const titleEl = document.createElement('h1');
  titleEl.classList.add('post-detail-title');
  titleEl.textContent = postDetail.title;

  // 👤 작성자 & 작성일 & 버튼 영역
  const headerEl = document.createElement('div');
  headerEl.classList.add('post-detail-header');


  headerEl.innerHTML = "";

  // post-meta 영역 생성
  const postMeta = document.createElement('div');
  postMeta.className = 'post-meta';

  // 닉네임 요소
  const nicknameSpan = document.createElement('span');
  nicknameSpan.className = 'nickname';
  nicknameSpan.textContent = postDetail.nickname;

  // 작성일 요소
  const dateSpan = document.createElement('span');
  dateSpan.className = 'date';
  dateSpan.textContent = new Date(postDetail.createdAt).toLocaleString();

  // postMeta에 요소 추가
  postMeta.appendChild(nicknameSpan);
  postMeta.appendChild(dateSpan);

  // header에 postMeta 추가
  headerEl.appendChild(postMeta);

  console.log('유저 id : ', userId);
  console.log('작성자 id :', authorId);

  // 작성자일 경우 수정/삭제 버튼 추가
  if (userId == authorId) {
    const postActions = document.createElement('div');
    postActions.className = 'post-actions';

    const editButton = document.createElement('button');
    editButton.id = 'editButton';
    editButton.textContent = '수정';

    const deleteButton = document.createElement('button');
    deleteButton.id = 'deleteButton';
    deleteButton.textContent = '삭제';

    postActions.appendChild(editButton);
    postActions.appendChild(deleteButton);
    headerEl.appendChild(postActions);

    // 이벤트 리스너

    editButton.addEventListener('click', () => {
      window.location.href = `/rewrite/${postDetail.id}`;
    });

    deleteButton.addEventListener('click', () => {
      console.log('삭제 버튼 클릭됨');
      const modal = document.querySelector('.modal');
      const btnOpenPopup = document.querySelector('.btn-open-popup');
      modal.style.display = 'block';
      modal.classList.toggle('show');
    });
  }

  


  // ✍️ 본문 내용
  const contentEl = document.createElement('div');
  contentEl.classList.add('post-detail-content');
  contentEl.textContent = postDetail.content;

  // 📊 하단 정보
  const footerEl = document.createElement('div');
  footerEl.classList.add('post-detail-footer');
  footerEl.innerHTML = `
    <button id="likeButton">❤️ 좋아요 ${postDetail.likeCount}</button>
    <span>조회수 ${postDetail.viewCount}</span>
    <span>댓글 ${postDetail.commentCount}</span>
  `;

  // 🧱 조립
  container.appendChild(titleEl);
  container.appendChild(headerEl);
  container.appendChild(document.createElement('hr'));
  container.appendChild(contentEl);
  container.appendChild(document.createElement('hr'));
  container.appendChild(footerEl);

}


