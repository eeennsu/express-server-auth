import Employee from '../model/Employee.js';

export const getAllEmployees = async (req, res) => {
    try {
        const allEmployees = await Employee.find({}).exec();

        res.status(200).json({ "suc": true, "employees": allEmployees });
    } catch (error) {
        console.log('getAllEmployees error : ', error);   
        res.status(500).json({ "suc": false, "message": error.message });
    }
}

export const createNewEmployee = async (req, res) => {

    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
        return res.status(400).json({ "suc": false, "message": "firstname and lastname are required." });
    }

    try {  
        // 동명이인이 있을 수 있기 때문에 중복 여부는 필요없다
        const newEmployee = new Employee({
            firstname,
            lastname
        });

        const result = await newEmployee.save();

        res.status(201).json({ "suc": true, "message": `New Employee ${firstname}-${lastname} created!` });           // 201은 요청이 성공적으로 이루어졌고, 새 데이터가 생성되었다는 뜻
    } catch (error) {
        console.log('getAllEmployees error : ', error);   
        res.status(500).json({ "suc": false, "message": error.message });
    }
}

export const updateEmployee = async (req, res) => {

    const { id, firstname, lastname } = req.body;

    if (!id || !firstname || !lastname) {
        return res.status(400).json({ "suc": false, "message": 'All parameter is required.' });
    }

    try {    
        const updatedEmployee = await Employee.findOneAndUpdate(
            { "_id": id },
            { firstname, lastname },
            { new: true }
        ).exec();

        // 사용자를 찾지 못하였을 경우엔
        if (!updatedEmployee) {
            return res.status(404).json({ "suc": false, "message": "not found user" });
        }

        return res.status(200).json({ "suc": true, "message": "success update!", "employee": updatedEmployee });

    } catch (error) {
        console.log('updateEmployee error : ', error);   
        res.status(500).json({ "suc": false, "message": error.message });
    }
}

export const deleteEmployee = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ "suc": false, "message": "id is required." });
    }

    try {
        const deletedUser = await Employee.deleteOne({ _id: id });
            
        if (!deletedUser) {
            return res.status(404).json({ "suc": false, "message": `${id} employee not founded.` })
        }

        return res.status(200).json({ "suc": true, "message": `${id} employee deleted.` })
       
    } catch (error) {
        console.log("deleteEmployee error : ", error);
        res.status(500).json({ "suc": false, "message": error.message });
    }
}

export const getEmployee = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ "suc": false, "message": "id params is required." })
    }

    try {
        const employee = await Employee.findOne({ "_id": id }).exec();

        if (!employee) {
            return res.status(404).json({ "suc": false, "message": `${id} employee not founded.` })
        }

        return res.status(200).json({ "suc": true, "employee": employee });
       
    } catch (error) {
        ("getEmployee error : ", error);
        res.status(500).json({ "suc": false, "message": error.message });
    }
}