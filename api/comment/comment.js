// '/api/posts/:postId/comments'

export async function fetchComments(postId) {

  try {
    const response = await fetch(`/api/posts/${postId}/comments`);
    if (!response.ok) throw new Error('댓글 요청 실패');

    const comments = await response.json();
    return comments;

  } catch (err) {
    console.error('댓글 로딩 오류:', err);
    return [];
  }
}
