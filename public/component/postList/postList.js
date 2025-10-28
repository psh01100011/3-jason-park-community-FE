export function setPostList(posts) {
  const postListContainer = document.getElementById('post-list');
  posts.forEach(post => {
    const item = document.createElement('div');
    item.classList.add('post-item');

    item.innerHTML = `
      <h3>${post.title}</h3><br>
      <small>조회수 ${post.viewCount} • 댓글 ${post.commentCount} • 좋아요  ${post.likeCount}</small>
      <hr>
      
      <small>${post.nickname} • ${new Date(post.createdAt).toLocaleString()}</small>
    `;

    item.addEventListener('click', () => {
      window.location.href = `/post/${post.id}`;
    });


    postListContainer.appendChild(item);
  });
}

