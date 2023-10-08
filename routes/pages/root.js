import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// public 폴더를 사용할 수 있게 해준다. image, txt 등을 사용할 수 있게 해준다
router.use(express.static('public'));

// / 도 가능하고, 정규표현식도 가능하다.
router.get('^/$|/index(.html)?', (req, res) => {
    // res.send('Hello Worlsd!');
    // res.sendFile('./view/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
});

// 역시 마찬가지로 정규표현식
router.get('/new-page(.html)?', (req, res) => {

    res.sendFile(path.join(__dirname, '..', '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {

    // 기본적으로 302 statusCode를 보내준다. 
    // 302는 페이지의 임시 이동을 나타내지만, 영구적인 이동을 나타내는 status는 301이다. 
    // 만약 영구적인 변경이라면 검색 엔진에게 새로운 url을 기억하게 하기 위해 301로 직접 넣어준다.
    res.redirect(301,'/new-page.html');
});


// hello 경로 그냥 테스트
router.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
}, (req, res) => {
    res.send('Hello world!');
});

export default router;