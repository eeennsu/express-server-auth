import allowedOrigins from '../config/allowedOrigins.js';

const corsOptions = {
    origin: (origin, cb) => {
   
        // 요청한 도메인이 whiteList에 있으면
        // !origin은, 일반적인 홈페이지 요청은 origin 이 없기 때문에, 이를 포함시켜줘야 한다.
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            cb(null, true);
        } else {
            // 없으면 에러를 전송
            cb(new Error('Not allowed by CORS'));
        }
    },

    // CORS 요청이 성공하면 브라우저에게 200 OK 상태 코드가 반환된다.
    optionsSuccessStatus: 200,
};

export default corsOptions;