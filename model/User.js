import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    // 기본으로 생성된 유저에게는 default로 2001 유저 role 부여
    roles: {
        User: {
            type: Number,
            default: 2001,
        },
        Editor: Number,         // 모든 사람이 editor, admin은 아니기에 디폴트를 주지 않는다.
        Admin: Number,
    },
    refreshToken: String,       // 항상 존재하는 것은 아니기에 required가 필요하지 않다.
});

const User = mongoose.model('User', userSchema);

export default User;