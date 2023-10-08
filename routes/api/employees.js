import { Router } from 'express';
import { createNewEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee } from '../../controllers/employeesController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';
import verifyJWT from '../../middleware/verifyJWT.js';

const router = Router();

router.route('/')
    // verifyJWT를 넣어 jwt토큰이 Bearer에 있는 유저만 (= 로그인한 유저만) 접근할 수 있다.
    // 관리자와 유저 는 getAll, get을 할 수 있고, 나머지 생성 수정 삭제는 관리자만 할 수 있다.
    .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), getAllEmployees)                                                   
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin), createNewEmployee)         
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), updateEmployee)             
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), deleteEmployee);                            

router.route('/:id')
    .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), getEmployee)

export default router;