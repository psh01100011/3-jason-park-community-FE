import { loadHeader } from '../../component/header/header.js';
import { loadFooter } from '../../component/footer/footer.js';
import { fetchPosts } from '../../../api/post/post.js';
import { setPostList } from '../../component/postList/postList.js';

if (document.getElementById('writeButton')) {
  document.getElementById('writeButton').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/write';
  });
} 


//무한 스크롤 : 스크롤 이벤트(과도한 호출이 발생할 수 있따고 함, 나중에 디바운스나 쓰로틀, 옵저버 적용 고려)
async function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    const newPosts = await fetchPosts();
    setPostList(newPosts);
  }
}


document.addEventListener('DOMContentLoaded', async () =>{
    //헤더 로딩
    loadHeader();
    loadFooter();
    // 게시물 리스트 채우기
    try{
        // 게시물 가져오는 api 호출 fetchPosts()
        const posts = await fetchPosts();
        //게시물 container에 채우는 함수 호출 : setPostList()
        setPostList(posts);

        //무한 스크롤 구현
        window.addEventListener('scroll', handleScroll);
    }catch(err){
        console.error('게시물 로딩 중 오류 발생:', err);
        document.getElementById('post-list').innerHTML = '<p>게시물을 불러오는 중 오류가 발생했습니다.</p>';
    }
});