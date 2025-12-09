# 3-jason-park-community-FE
커뮤니티 프론트엔드


# 아무말 담벼락

### 프로젝트 설명

사진과 글을 자유롭게 올리며 소통할 수 있는 웹 커뮤니티 서비스입니다.

### 기술 스택

- Frontend: Vanilla JS, HTML/CSS, Fetch API
- Backend: Spring Boot, JPA, MySQL
- DevOps: AWS EC2, AWS RDS, Nginx, Docker Compose

### 시연 영상



https://github.com/user-attachments/assets/ec1e9ef0-8f82-476e-bd8e-30903118a0ef



### 아키텍처(AWS) 및 기능 설명
<img width="768" height="497" alt="jason park(개인프로젝트-아키텍처)" src="https://github.com/user-attachments/assets/fc2c45b5-cb0c-4db0-ba4a-a652bd61d0ee" />


Nginx + WS

- WS의 실행 부담이 크지 않을 것으로 판단하여 Nginx와 같이 하나의 인스턴스에 동작시킴
- WS
    - express 기반의 정적 페이지 서빙
    - 게시물 무한 스크롤링 구현
    - debounce를 통한 api 호출 제어(게시물 리스트, 이메일 중복 확인, 닉네임 중복 확인)

- Nginx : SSL 인증서를 통한 Https 통신과 WS, WAS 라우팅 구현

NAT + Bastion Instance

- Private subnet에 있는 WAS에 배포하기 위해 사용
- Bastion Instance : Private Subnet에 있는 Instance에 ssh 접근을 하기위해 사용
- NAT Instance : Private Subnet에 있는 Instance가 인터넷 요청을 보낼 수 있도록 사용
    - 패키지나 Docker Image를 다운로드
    - 비용이 많이 드는 NAT Gateway 대신 Instance에 직접 구축하여 사용

 

WAS

- SpringBoot 기반의 웹 애플리케이션 서버 구현
- JWT와 Filter를 구현하여 인증/인가 처리
- 페이징을 통한 게시물 처리

RDS

- mysql 사용
- AWS 서비스 활용하여 복잡한 DB 관리는 위탁

API Gateway + Lambda + S3

- 이미지는 S3에 저장
- Lambda를 통한 이미지 저장
- API Gateway를 통한 Lambda 엔드포인트 제공

### CI/CD 파이프라인

gitAction을 활용하여, main brance에 Push 이벤트 발생 시

- 테스트
- 이미지 빌드 후 private registry에 push
- 인스턴스 ssh 접근 (was는 bastion Instance를 통해 ssh 접근)
- 이미지를 pull 한 뒤 컨테이너 실행
