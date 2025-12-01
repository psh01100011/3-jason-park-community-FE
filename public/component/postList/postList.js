export function setPostList(posts) {
  const postListContainer = document.getElementById('post-list');
  posts.forEach(post => {
    const item = document.createElement('div');
    item.classList.add('post-item');

    item.innerHTML = `
      <h3>${post.title}</h3><br>
      <small>조회수 ${post.viewCount} • 댓글 ${post.commentCount} • 좋아요  ${post.likeCount}</small>
      <hr>
      
      <div class="post-user">
      <img class="profile-img" src="${post.profileImage || '/basic.jpg'}" alt="profile">
      <small>${post.nickname} • ${new Date(post.createdAt).toLocaleString()}</small>
      </div>
    `;

    item.addEventListener('click', () => {
      window.location.href = `/post/${post.id}`;
    });


    postListContainer.appendChild(item);
  });
}

