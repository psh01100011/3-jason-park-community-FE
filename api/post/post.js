// public/api/post.js
let lastPostId = null;
let isEnd = false;
let isLoading = false;

export async function fetchPosts(limit = 10) {
  if (isLoading || isEnd) return [];
  isLoading = true;

  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts/list?lastPostId=${lastPostId || ''}&limit=${limit || 5}`);
    if (!response.ok) throw new Error('게시물 요청 실패');

    const posts = await response.json();
    console.log(posts);
    if (posts.length === 0) {
      isEnd = true;
      return [];
    }

    lastPostId = posts[posts.length - 1].id; // 마지막 게시물 ID 갱신
    return posts;

  } catch (err) {
    console.error('게시물 로딩 오류:', err);
    return [];
  } finally {
    isLoading = false;
  }
}

export async function fetchPostDetail(postId) {
  console.log('백엔드 연동 : 게시물 상세보기');
  try{
    const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}`,{
      method: 'GET',
      credentials: 'include' 
    });
    if(!response.ok) throw new Error('게시물 상세 요청 실패');
    const postDetail = await response.json();
    return postDetail;
  }catch(err){
    console.error('게시물 상세 로딩 오류:', err);
    return null;
  }
}