import { fetchRequest } from '../../../api/auth/auth.js';
import { address } from '../../../config/config.js';

// public/api/post.js
let lastPostId = null;
let isEnd = false;
let isLoading = false;

export async function fetchPosts(limit = 10) {
  if (isLoading || isEnd) return [];
  isLoading = true;

  try {
    const url = `${address}/api/v1/posts/list?lastPostId=${lastPostId || ''}&limit=${limit || 5}`;
    const option = {
        method: 'GET',
        credentials: 'include' 
    };
    const response = await fetchRequest(url, option);
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
    const url = `${address}/api/v1/posts/${postId}`;
    const option = {
      method: 'GET',
      credentials: 'include' 
    };
    const response = await fetchRequest(url, option);
    if(!response.ok) throw new Error('게시물 상세 요청 실패');
    const postDetail = await response.json();
    return postDetail;
  }catch(err){
    console.error('게시물 상세 로딩 오류:', err);
    return null;
  }
}