const express = require('express');
//const {address} = require('./config/appConfig.js');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
require('dotenv').config();

const fs = require('fs');
// config.js 생성 (프론트 전용 ES Module 파일)
const configJS = `
export const address = "${process.env.ADDRESS}";
export const s3_address = "${process.env.S3_ADDRESS}";
`;

const configDir = path.join(__dirname, './config');

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}


console.log(configJS);
fs.writeFileSync(
  path.join(configDir, 'config.js'),
  configJS
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    credentials: 'true' 
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/assets')));

app.get('/cicdtest', (req, res) => {
  res.send('Hello, World!');
});

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
  res.redirect(`${process.env.ADDRESS}api/v1/policy/terms`);
});
app.get('/privacy', (req, res) => {
  res.redirect(`${process.env.ADDRESS}/api/v1/policy/privacy`);
});


// public 폴더
// js 파일
app.get(/.*\.js$/, (req, res) => {
  res.type('application/javascript');
  res.sendFile(__dirname + req.path);
});

app.get(/.*\.js$/, (req, res) => {
  res.type('application/javascript');
  res.sendFile(__dirname + req.path);
});

// css 파일
app.get(/.*\.css$/, (req, res) => {
  res.type('text/css');
  res.sendFile(__dirname + req.path);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});