import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fsPromises = fs.promises;

// logEvent는 내부에서 직접 함수로 넣어줘서 사용하는 것
export const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyy-MM-dd | hh:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    console.log('logItem : ', logItem);

    // 폴더가 없으면 생성
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..','logs'));
    }

    try {
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);
    } catch (err) {
        console.error(err);
    }
}

// logger는 정석적으로 app.use()로 사용해주는 것  
export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    
    console.log('요청 method : ', req.method);
    console.log('요청의 경로 : ', req.path);

    next();
}