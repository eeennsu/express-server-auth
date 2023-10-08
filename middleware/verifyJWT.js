import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
    
    // 애초에 헤더에 인증이 없으면 반환한다. 또한 키값이 대문자로도 올 수 있다.
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Bearer로 시작하지 않으면
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ "message": "authorization 헤더가 없습니다." });
    }

    const tmp = authHeader.split(' ');
    if (tmp.length !== 2) {
        return res.status(401).json({ "meesage": "authorization 해더에서 token을 얻을 수 없습니다." });
    }
    const token = tmp[1];
    console.log('token', token);
    jwt.verify(
        token,  
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
            if (err) return res.status(403).json({ "message": err.message });    // 유효하지 않은 토큰

            req.email = decoded.email;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

export default verifyJWT;