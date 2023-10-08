import User from '../model/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ "suc": false, "message": "email and password is required" });
    }

    try {
        const user = await User.findOne({ email }).exec();

        // 일치하는 유저 (이메일) 을 찾지 못했으면?
        if (!user) {
            return res.status(401).json({ "suc": false, "message": "email not exist" })
        }
        
        // password도 평가해야한다
        const match = await bcrypt.compare(password, user.password);

        // 비밀번호가 일치하지 않으면 리턴
        if (!match) {
            return res.status(401).json({ "suc": false, "message": "password does not match" });
        }

        // roles키의 값을 가져옴
        const roles = Object.values(user.roles);

        // access 토큰 발급
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": user.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                // 3분간의 유예 적용 (테스트용, 실제는 이거보다 더 길게)
                expiresIn: '600s'
            }
        );

        // refresh용 토큰 발급
        const refreshToken = jwt.sign(
            {
                "email": user.email
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                // 하루간의 유예 적용
                expiresIn: '1d'
            }
        );     

        user.refreshToken = refreshToken;

        await user.save();
    
        // 100% 안전하지는 않지만, httpOnly를 적용하면 쿠키를 js에서 사용할 수 없도록 한다
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });   // secure: true
        res.json({ accessToken });

    } catch (error) {
        console.log('handleLogin error : ', error);
        res.status(500).json({ "suc": false, "message": error.message })
    } 
}