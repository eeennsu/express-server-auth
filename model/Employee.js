import mongoose from 'mongoose';

// 객체 id는 자동으로 생김
const employeeSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;