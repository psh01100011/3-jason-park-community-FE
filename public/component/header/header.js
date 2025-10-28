import { getCookie } from '../../../util/cookie.js';
import { checkSession } from '../../../util/session.js';

export async function loadHeader() {
  

  const headerContainer = document.querySelector('.header-container');
  if (!headerContainer) return;

  // 헤더 wrapper
  const header = document.createElement('header');
  header.classList.add('app-header');

  // 뒤로가기 버튼
  const backBtn = document.createElement('button');
  backBtn.textContent = '◀';
  backBtn.addEventListener('click', () => {
    history.back(); // 이전 페이지로 이동 : 우리 사이트 내에서만 작동하도록 수정 필요
  });
  backBtn.classList.add('back-btn');

  // 앱 이름
  const title = document.createElement('h1');
  title.textContent = '아무말대잔치';
  title.classList.add('app-title');
  title.addEventListener('click', () => {
    window.location.href = '/';
  });

  // 프로필 버튼
  const profileBtn = document.createElement('button');
  if(!await checkSession()){
    profileBtn.textContent = '로그인';
    profileBtn.addEventListener('click', async (e) => {
        window.location.href = '/login';
    });
  }
  else{
    profileBtn.textContent = '프로필';
    profileBtn.addEventListener('click', async (e) => {
    //프로필 수정 버트 리스트 볼 수 있도록?
      try {
        let menu = document.getElementById('profileMenu');
        if (menu) {
          menu.classList.toggle('hidden');
          return;
        }

        menu = document.createElement('div');
        menu.id = 'profileMenu';
        menu.classList.add('profile-menu');

        menu.innerHTML = `
          <ul>
            <li id="editProfileBtn">내 정보 수정</li>
            <li id="editPasswordBtn">비밀번호 변경</li>
            <li id="logoutBtn">로그아웃</li>
          </ul>
        `;

        // body 또는 적절한 컨테이너에 붙이기
        document.body.appendChild(menu);

        // 프로필 버튼 근처로 위치 조정
        const rect = profileBtn.getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left - 50}px`;

        // 이벤트 연결
        document.getElementById('editProfileBtn').addEventListener('click', () => {
          window.location.href = '/status/me';
        });

        document.getElementById('editPasswordBtn').addEventListener('click', () => {
          window.location.href = '/auth/me';
        });

        document.getElementById('logoutBtn').addEventListener('click', async() => {
          try {
            const response = await fetch('/auth/logout', {
                method: 'DELETE'
            });

            if(response.status == 200){
              console.log('로그아웃 성공')
            }
            else{
              console.log('로그아웃 실패')
            }

            window.location.href = '/login';
          
          }catch (err) {
              console.error('프로필 표시 중 오류 발생:', err);
              window.location.href = '/login';
          }
        });

        // 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', (event) => {
          if (!menu.contains(event.target) && event.target !== profileBtn) {
            menu.remove();
          }
        });


        

      } catch (err) {
          console.error('프로필 표시 중 오류 발생:', err);
      }
    });
  }



  




  profileBtn.classList.add('profile-btn');
  header.appendChild(backBtn);
  header.appendChild(title);
  header.appendChild(profileBtn);
  headerContainer.appendChild(header);
}