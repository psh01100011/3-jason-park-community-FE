import { getCookie } from '../../../util/cookie.js';
import { fetchRequest } from '../../../api/auth/auth.js';
import { address } from '../../../config/config.js';

export function setPostDetail(postDetail) {
  const container = document.getElementById('post-detail-container');
  container.innerHTML = '';

  const userId = sessionStorage.getItem("userId");
  const authorId = postDetail.userId;

  // 제목
  const titleEl = document.createElement('h1');
  titleEl.classList.add('post-detail-title');
  titleEl.textContent = postDetail.title;

  // 작성자 & 작성일 & 버튼 영역
  const headerEl = document.createElement('div');
  headerEl.classList.add('post-detail-header');

  // post-meta 영역
  const postMeta = document.createElement('div');
  postMeta.className = 'post-meta';

  // 프로필 이미지
  const profileImageSpan = document.createElement('img');
  profileImageSpan.className = 'profile-img';
  profileImageSpan.src = postDetail.profileImage || '/basic.jpg';
  profileImageSpan.alt = 'profile';

  // 닉네임
  const nicknameSpan = document.createElement('span');
  nicknameSpan.className = 'nickname';
  nicknameSpan.textContent = postDetail.nickname;

  // 작성일
  const dateSpan = document.createElement('span');
  dateSpan.className = 'date';
  dateSpan.textContent = new Date(postDetail.createdAt).toLocaleString();

  postMeta.appendChild(profileImageSpan);
  postMeta.appendChild(nicknameSpan);
  postMeta.appendChild(dateSpan);
  headerEl.appendChild(postMeta);

  console.log('유저 id : ', userId);
  console.log('작성자 id :', authorId);

  // 작성자일 경우 수정/삭제 버튼 추가
  if (userId == authorId) {
    const postActions = document.createElement('div');
    postActions.className = 'post-actions';

    const editButton = document.createElement('button');
    editButton.id = 'editButton';
    editButton.textContent = '고쳐쓰기';

    const deleteButton = document.createElement('button');
    deleteButton.id = 'deleteButton';
    deleteButton.textContent = '떼어내기';

    postActions.appendChild(editButton);
    postActions.appendChild(deleteButton);
    headerEl.appendChild(postActions);

    editButton.addEventListener('click', () => {
      window.location.href = `/rewrite/${postDetail.id}`;
    });

    deleteButton.addEventListener('click', () => {
      console.log('삭제 버튼 클릭됨');
      const modal = document.querySelector('.modal');
      modal.classList.add('show');
    });
  }

  // 모달 관련 요소들
  const modal = document.getElementById('post-modal');
  const confirmBtn = document.getElementById('confirmDeletePost');
  const cancelBtn = document.getElementById('cancelDeletePost');

  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  confirmBtn.addEventListener('click', async () => {
    try {
      const url = `${address}/api/v1/posts/${postDetail.id}/status`;
      const option = {
        method: 'PATCH',
        credentials: 'include'
      };
      const response = await fetchRequest(url, option);

      if (!response.ok) {
        alert('삭제에 실패했습니다.');
        console.log(await response.text());
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: '삭제되었습니다!',
        timer: 1500,
        showConfirmButton: false
      });
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert('에러가 발생했습니다.');
    } finally {
      modal.classList.remove('show');
    }
  });

  
  // 본문 이미지
  const imageEl = document.createElement('img');
  if(postDetail.image != null){
    imageEl.src = postDetail.image;
    imageEl.classList.add('post-detail-image');
  }


  // 본문 내용
  const contentEl = document.createElement('div');
  contentEl.classList.add('post-detail-content');
  contentEl.textContent = postDetail.content;

  // 하단 정보 (좋아요, 조회수, 댓글)
  const footerEl = document.createElement('div');
  footerEl.classList.add('post-detail-footer');
  footerEl.innerHTML = `
    <button id="likeButton">🤍 좋아요 ${postDetail.likeCount}</button>
    <span>조회수 ${postDetail.viewCount}</span>
    <span>댓글 ${postDetail.commentCount}</span>
  `;

  // --- DOM 조립 순서 ---
  container.appendChild(titleEl);
  container.appendChild(headerEl);
  container.appendChild(document.createElement('hr'));
  container.appendChild(imageEl);
  container.appendChild(contentEl);
  container.appendChild(document.createElement('hr'));
  container.appendChild(footerEl);

  // ===== 좋아요 관련 로직 (postDetail, likeButton에 클로저로 묶기) =====
  const likeButton = footerEl.querySelector('#likeButton');

  function updateLikeButton(isLiked) {
    if (isLiked) {
      likeButton.dataset.liked = 'true';
      likeButton.innerHTML = `❤️ 좋아요 ${postDetail.likeCount}`;
    } else {
      likeButton.dataset.liked = 'false';
      likeButton.innerHTML = `🤍 좋아요 ${postDetail.likeCount}`;
    }
  }

  // 좋아요 상태 조회
  async function loadLikeState() {
    try {
      const url = `${address}/api/v1/posts/${postDetail.id}/like`;
      const option = {
        method: 'GET',
        credentials: 'include'
      };

      const response = await fetchRequest(url, option);
      if (!response.ok) {
        console.log(await response.text());
        return;
      }

      const isLiked = await response.json(); // true / false
      console.log(isLiked, typeof isLiked);
      updateLikeButton(isLiked);
    } catch (error) {
      console.error('좋아요 상태 조회 실패', error);
    }
  }

  // 좋아요 버튼 클릭 → 토글
  likeButton.addEventListener('click', async () => {
    const isLiked = likeButton.dataset.liked === 'true';

    const url = `${address}/api/v1/posts/${postDetail.id}/like`;
    const option = {
      method: isLiked ? 'DELETE' : 'POST',
      credentials: 'include'
    };

    try {
      const response = await fetchRequest(url, option);
      if (!response.ok) {
        console.log(await response.text());
        return;
      }

      const newState = await response.text();

      // 좋아요 수 변화는 직접 계산
      if (newState =='liked') {
        postDetail.likeCount += 1;
      } else {
        postDetail.likeCount -= 1;
      }
      updateLikeButton(!isLiked);
    } catch (error) {
      console.error('좋아요 토글 실패', error);
    }
  });

  // 페이지 진입 시 좋아요 상태 1회 조회
  loadLikeState();
}