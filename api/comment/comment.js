// '/api/posts/:postId/comments'
import { fetchRequest } from '../../../api/auth/auth.js';

export async function fetchComments(postId) {
  try {
    const url = `http://localhost:8080/api/v1/posts/${postId}/comments/list`
    const option = {
        method: 'GET',
        credentials: 'include' 
    };
    const response = await fetchRequest(url, option);
    if (!response.ok) throw new Error('댓글 요청 실패');

    const comments = await response.json();
    return comments;

  } catch (err) {
    console.error('댓글 로딩 오류:', err);
    return [];
  }
}
