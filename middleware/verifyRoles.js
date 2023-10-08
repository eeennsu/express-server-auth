const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {

        // 로그인할 때 roles 속성을 부여했다. 만약 이게 없으면 오류이다
        if (!req?.roles) {
            return res.status(401).json({ "message": "none roles..." });
        }

        const rolesArray = [...allowedRoles];

        // 유저의 role에 rolesArray의 값이 포함되어 있는지의 배열속에서, true값을 찾는다.
        const result = req.roles.map(role => rolesArray.includes(role)).find(value => value === true);
        
        // console.log(req.roles);
        // console.log(rolesArray);
        // 사용자의 역할이 허용된 역할 중 하나와 일치하지 않는 경우, 허용하지 않은 roles이므로 접근 금지해야한다. 401 상태 코드로 응답을 보내고 검증을 중단
        if (!result) {
            return res.status(401).json({ "message": "not found math roles" });
        }

        next();
    }
}

export default verifyRoles;