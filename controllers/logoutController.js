import User from '../model/User.js';

export const handleLogout = async (req, res) => {

    // 백엔드에서도, 클라이언트에서도 jwt는 같이 삭제해야 한다.
    const { cookies } = req;

    // 만약 쿠키에 jwt이 없는데 로그아웃을 하려고 한다면, 요청은 성공했지만 그 결과로 어떠한 콘텐츠 반환도 필요없음을 알림
    // 즉, 로그아웃음 성공했음
    if (!cookies?.jwt) {
        console.log('쿠키가 없지만 일단 성공은 시켜줄게');
        return res.status(200).json({ "suc": true, "message": "none jwt cookie, but logout is success" });
    }

    const refreshToken = cookies.jwt;

    try {
        // db에서 refreshToken을 공백으로 초기화
        const updatedUser = await User.findOneAndUpdate(
            { refreshToken },                   // 뭐로 찾을 것인지
            { refreshToken: '' },               // 무엇을 어떻게 업데이트할것인지
            { new: true },                      // 업데이트 반영할것인지
        )
        
        if (!updatedUser) {
            // 만약 일치하는 유저를 찾지 못했으면
            // 일단 이 지점에 있는 쿠키가 있다는 뜻이니, 필요없는 쿠키는 클리어
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.status(200).json({ "suc": true });
        }

        // 이후 클라이언트에서 barer toekn을 없애는 작업 필요
        
        // 모든것이 성공하였으면
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(200).json({ "suc": true, "mesage": "logout successed" });
    } catch (error) {
        res.status(500).json({ "suc": false, "message": error.message });
    }
}