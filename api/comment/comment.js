// '/api/posts/:postId/comments'
import { fetchRequest } from '../../../api/auth/auth.js';
import { address } from '../../../config/config.js';

// 댓글 목록 가져오기
export async function fetchComments(postId) {
  try {
    const url = `${address}/api/v1/posts/${postId}/comments/list`
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
