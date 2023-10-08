import bcrypt from 'bcrypt';
import User from '../model/User.js';

// 입력한 암호를 해시하고 정렬하여 안전하게 저장해주는 기능
const saltRounds = 10;

export const handleNewUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ "suc": false, "message": "Username and password required" });
        }

        // db내에 중복된 유저 이메일이 없는지 체크한다. -1은 찾는 인덱스가 없다는 뜻이기에, -1이 아니면 기존 배열에 있다는 뜻이고, 이는 중복을 유발한다.
        // exec()는 쿼리를 실행하고 해당 쿼리의 결과를 반환하는 기능을 한다.
        const existUser = await User.findOne({ email: email }).exec();

        if (existUser) {
            return res.status(409).json({ "suc": false, "message": `${email} is already exist.` });         // 충돌을 나타내는 서버 상태
        }
        
        // salt 생성
        const salt           = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 새 유저 객체를 생성
        const newUser = new User({ 
            email,
            password: hashedPassword
        });

        // 이후 디비에 저장
        const result = await newUser.save();

        console.log(result);

        // 성공 상태 보내기 (201은 정보 추가 성공을 알리는 코드)
        res.status(201).json({ "suc": true, "message": `New user ${email} created!` });
    } catch (error) {
        res.status(500).json({ "suc": false, "message": error.message });
    }
}