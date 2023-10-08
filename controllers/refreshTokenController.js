import User from '../model/User.js';
import jwt from 'jsonwebtoken';

export const handleRefreshToken = async (req, res, next) => {
    const { cookies } = req;
    
    // 만약 쿠키에 기존 refreshToken가 없는데 refresh 하는 거라면 이상하다. 따라서 오류 리턴
    if (!cookies?.jwt) {
        return res.status(401).json({ "suc": false, "message": "none cookie" });
    }

    const refreshToken = cookies.jwt;

    try {
        // refresh 하려는 유저를 찾는다
        const user = await User.findOne({ refreshToken }).exec();

        // 찾지 못했으면 리턴
        if (!user) {
            return res.status(401).json({ "suc": false, "message": "not found matched user with refreshToken." });
        }

        // refreshToken이 유효한지 검사
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        if (user.email !== decoded.email) {
            return res.status(403).json({ "suc": false, "message": "not matched refreshToken" });
        }

        const roles = Object.values(user.roles);

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": decoded.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,                
            { 
                expiresIn:'600s' 
            }
        );

        // 발급 후 클라이언트에 전달
        console.log('refresh token 발급 완료!');
        res.status(200).json({ "suc": true, accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "suc": false, "message": error.message });
    }
}