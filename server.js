import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logger } from './middleware/logEvents.js';
import customErrorHandler from './middleware/customErrorHandler.js';
import corsOptions from './config/corsOptions.js';
import credentials from './middleware/credentials.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 경로 임포트
import root from './routes/pages/root.js';
import subdir from './routes/pages/subdir.js';
import register from './routes/api/register.js';
import login from './routes/api/login.js';
import refresh from './routes/api/refresh.js';
import logout from './routes/api/logout.js';
import employees from './routes/api/employees.js';

const PORT = process.env.PORT || 3500;
const app = express();

// env를 읽기위한 기능
dotenv.config();

// 사용자 지정 커스텀 미들웨어 - 로거
app.use(logger);

// credential 옵션을 CORS 적용 전에 체크해주어야 한다.
app.use(credentials);

// cors 오류 해결하는 미들웨어 적용,
// 요청을 허용하는 사이트 주소를 따로 지정할 수도 있다. 
app.use(cors(corsOptions));

// 미들웨어를 사용하겠다는 뜻. 들어오는 모든 경로에는 이 미들웨어 기능을 거친다.
// 해당 미들웨어는 POST요청으로 온 body 에서 데이터를 추출하기 위해 사용된다. 주로 html의 form 에서 제출된 데이터를 파싱할 떄 사용한다.
// extended를 false로 설정하면 데이터는 단순한 문자열 또는 배열로 파싱된다.
app.use(express.urlencoded({ extended: false }));

// ,JSON 데이터를 파싱하고, 이를 js 객체로 변환해주는 역할을 한다.
app.use(express.json());

// 쿠키 미들웨어 적용
app.use(cookieParser());

// 각 경로의 라우터 사용 (페이지 로드), 리엑트에선 사용x
app.use('/', root);
app.use('/subdir', subdir);

// 각 경로의 라우터 사용 (API)
app.use('/register', register);
app.use('/login',     login);
app.use('/refresh',  refresh);          
app.use('/logout',   logout);
app.use('/employees', employees);

// 커스텀 에러 핸들러
app.use(customErrorHandler);

// 몽구스 디비 연결과 서버를 수행하는 로직이며, 항상 파일의 끝에 있어야 한다.
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('mongoDB is connected!');

        // mongodb가 연결에 성공하였을 때만 서버 실행하도록
        app.listen(PORT, () => {
            console.log(`Server running on Port ${PORT}!`);
        });
    })
    .catch((error) => {
        console.log('init error : ', error);
    });
