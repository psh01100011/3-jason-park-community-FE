const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    credential: 'true' 
}));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/pages/index/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/pages/login/login.html');
});

app.get('/regist', (req, res) => {
  res.sendFile(__dirname + '/public/pages/regist/regist.html');
});
app.get('/write', (req, res) => {
  res.sendFile(__dirname + '/public/pages/write/write.html');
});
app.get('/rewrite/:postId', (req, res) => {
  const { postId } = req.params;
  res.sendFile(__dirname + '/public/pages/write/rewrite.html');
});
app.get(`/post/$`, (req, res) => {
  res.sendFile(__dirname + '/public/pages/write/write.html');
});
app.get('/post/:postId', (req, res) => {
  const { postId } = req.params;
  console.log('게시물 ID:', postId);
  res.sendFile(__dirname + '/public/pages/post/post.html');
});
app.get('/auth/me', (req, res) => {
  res.sendFile(__dirname + '/public/pages/profile/password.html');
});
app.get('/status/me', (req, res) => {
  res.sendFile(__dirname + '/public/pages/profile/myinfo.html');
});


//footer 
app.get('/terms', (req, res) => {
  res.redirect('http://localhost:8080/api/v1/policy/terms');
});
app.get('/privacy', (req, res) => {
  res.redirect('http://localhost:8080/api/v1/policy/privacy');
});


// public 폴더
// js 파일
app.get(/.*\.js$/, (req, res) => {
  res.type('application/javascript');
  res.sendFile(__dirname + req.path);
});

// css 파일
app.get(/.*\.css$/, (req, res) => {
  res.type('text/css');
  res.sendFile(__dirname + req.path);
});

//백엔드 api 관련 (잊지않고 나중에 전부 프록시 제거하기 + url 수정하기)

//프록시 로그인 처리
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
try {
    const response = await fetch('http://localhost:8080/api/v1/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });
    if(response.status === 201){
      const userId = await response.text();
      response.headers.forEach((value, name) => {
        if (name.toLowerCase() === 'set-cookie') {
          console.log(name,':', value);
          res.cookie('JSESSIONID', value.split(';')[0].split('=')[1]);
          
          console.log(userId);
          res.cookie('userId', userId);
        }
      });
    
      res.status(200).json({
          message: '로그인 성공',
          success: true
      });
      console.log('auth/login : 로그인 성공');
        
    }
    else{
        res.status(401).json({
            message: '로그인 실패',
            success: false
        });
        console.log('auth/login : 로그인 실패');
    }
  } catch (err) {
    console.error('로그인 프록시 에러:', err);
    res.status(500).json({ message: '로그인 중 오류 발생' });
  }
});


//로그아웃
app.delete('/auth/logout', async (req, res) => {
  const cookieHeader = req.headers.cookie || '';
  try {
      const response = await fetch('http://localhost:8080/api/v1/auth', {
        method: 'DELETE',
        headers: {
          'Cookie': cookieHeader 
        }
      });
      if(response.status === 200){
        console.log('auth/logout : 로그아웃 성공');
        res.status(200).json({
              message: '로그아웃 성공',
              success: true
          });
      }
      else{
          res.status(401).json({
              message: '로그아웃 실패',
              success: false
          });
          console.log('auth/logout : 로그아웃 실패');
      }
    } catch (err) {
      console.error('로그아웃 프록시 에러:', err);
      res.status(500).json({ message: '로그아웃 중 오류 발생' });
    }
});







//프록시 내 프로필
app.get('/users/me', async (req, res) => {
    console.log('users/me 호출됨');
    try {
        const cookieHeader = req.headers.cookie || '1';
        console.log('users/me 요청 쿠키:', cookieHeader);

        const response = await fetch('http://localhost:8080/api/v1/users/me', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Cookie': cookieHeader 
          }
        });
        // 백엔드에서 내려온 데이터를 그대로 전달
        const text = await response.text();
        console.log('users/me 응답 상태:', text);
        let body;
        try { body = JSON.parse(text); } catch { body = { message: text }; }

        res.status(response.status).json(body);

    } catch (err) {
        console.error('유저 정보 조회 프록시 에러:', err);
        res.status(500).json({ message: '유저 정보를 불러오는 중 오류 발생' });
    }
});


//프록시 게시물 리스트
app.get('/api/posts', async (req, res) => {
  const { lastPostId, limit } = req.query;
  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts?lastPostId=${lastPostId || ''}&limit=${limit || 5}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('프록시 오류:', err);
    res.status(500).json({ message: '게시물 가져오기 실패' });
  }
});


//프록시 댓글 리스트
app.get('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}/comments`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('프록시 오류:', err);
    res.status(500).json({ message: '게시물 가져오기 실패' });
  }
});




//프록시 게시물 상세보기
app.get('/api/postDetail/:postId', async (req, res) => {
  console.log("게시물 상세보기 프록시 호출")
  const { postId } = req.params;
  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}`);
    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error('프록시 오류:', err);
    res.status(500).json({ message: '게시물 가져오기 실패' });
  }
});



//이메일 중복
app.post('/users/email', async (req, res) => {
  const email= req.body;
  try {
    const response = await fetch('http://localhost:8080/api/v1/users/email',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        email
      ),
    });
    const data = await response.json();
    console.log('프록시 /users/email 응답:', data);
    res.json(data);
  
  } catch (err) {
    console.error('프록시 오류:', err);
    res.status(500).json({ message: '게시물 가져오기 실패' });
  }
});


//닉네임 중복
app.post('/users/nickname', async (req, res) => {
  const nickname= req.body;
  try {
    const response = await fetch('http://localhost:8080/api/v1/users/nickname',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        nickname
      ),
    });
    const data = await response.json();
    console.log('프록시 /users/nickname 응답:', data);
    res.json(data);
  
  } catch (err) {
    console.error('프록시 오류:', err);
    res.status(500).json({ message: '게시물 가져오기 실패' });
  }
});


//프록시 회원가입 처리
app.post('/auth/regist', async (req, res) => {
  const { email, nickname, password } = req.body;
  try {
    const response = await fetch('http://localhost:8080/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        nickname,
        password
      }),
    });
    if(response.status === 201){
      res.status(201).json({
          message: '회원가입 성공',
          success: true
      });
      console.log('auth/regist : 회원가입 성공');
        
    }
    else{
        res.status(400).json({
            message: '회원가입 실패',
            success: false
        });
        console.log('auth/regist : 회원가입 실패');
    }
  } catch (err) {
    console.error('회원가입 프록시 에러:', err);
    res.status(500).json({ message: '회원가입 중 오류 발생' });
  }
});

// 댓글 작성
app.post('/api/posts/:postId/comments', async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  const cookieHeader = req.headers.cookie || '';
  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify({
        content
      }),
    }); 
    if(response.status === 200){
      res.status(201).json({
          message: '댓글 작성 성공',
          success: true
      });
      console.log('댓글 작성 성공');
        
    }
    else{
        res.status(400).json({
            message: '댓글 작성 실패',
            success: false
        });
        console.log('댓글글 작성 실패');
    }
  } catch (err) {
    console.error('댓글 작성 프록시 에러:', err);
    res.status(500).json({ message: '댓글 작성 중 오류 발생' });
  }


});


//게시글 작성
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const cookieHeader = req.headers.cookie || '';
  try {
    const response = await fetch('http://localhost:8080/api/v1/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify({
        title,
        content
      }),
    }); 
    if(response.status === 201){
      res.status(201).json({
          message: '글 작성 성공',
          success: true
      });
      console.log('posts : 글 작성 성공');
        
    }
    else{
        res.status(400).json({
            message: '글 작성 실패',
            success: false
        });
        console.log('posts : 글 작성 실패');
    }
  } catch (err) {
    console.error('글 작성 프록시 에러:', err);
    res.status(500).json({ message: '글 작성 중 오류 발생' });
  }
});

//게시글 수정
app.patch('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const cookieHeader = req.headers.cookie || '';
  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify({
        title,
        content
      }),
    }); 
    if(response.status === 200){
      res.status(201).json({
          message: '글 수정 성공',
          success: true
      });
      console.log('posts : 글 수정 성공');
        
    }
    else{
        res.status(400).json({
            message: '글 수정 실패',
            success: false
        });
        console.log('posts : 글 수정 실패');
    }
  } catch (err) {
    console.error('글 수정 프록시 에러:', err);
    res.status(500).json({ message: '글 수정 중 오류 발생' });
  }
});

//비밀번호 수정
app.patch('/auth/me', async (req, res) => {
  const { password } = req.body;
  const cookieHeader = req.headers.cookie || '';
  try {
    const response = await fetch('http://localhost:8080/api/v1/users/me/auth', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify({
        password
      }),
    });
    if(response.status === 204){
      res.status(200).json({
          message: '비밀번호 수정 완료',
          success: true
      });
      console.log('auth/regist : 비밀번호 수정 성공');
        
    }
    else{
        res.status(400).json({
            message: '비밀번호 실패',
            success: false
        });
        console.log('auth/me : 비밀번호 수정 실패');
    }
  } catch (err) {
    console.error('비밀번호 프록시 에러:', err);
    res.status(500).json({ message: '비밀번호 중 오류 발생' });
  }
});


//내 정보 수정 수정
app.patch('/me', async (req, res) => {
  const { nickname } = req.body;
  const cookieHeader = req.headers.cookie || '';
  try {
    const response = await fetch('http://localhost:8080/api/v1/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify({
        nickname
      }),
    });
    if(response.status === 204){
      res.status(200).json({
          message: '내 정보 수정 완료',
          success: true
      });
      console.log('auth/regist : 내 정보 수정 성공');
        
    }
    else{
        res.status(400).json({
            message: '내 정보 실패',
            success: false
        });
        console.log('auth/me : 내 정보 수정 실패');
    }
  } catch (err) {
    console.error('내 정보 수정 프록시 에러:', err);
    res.status(500).json({ message: '내 정보 수정 중 오류 발생' });
  }
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});