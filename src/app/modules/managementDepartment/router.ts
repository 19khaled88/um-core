
import express from 'express'
import { managementDepartmentController } from './controller'
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';


const router = express.Router()


router.post('/create-management-department',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),managementDepartmentController.createManagementDepartment);
router.get('/all',managementDepartmentController.getAllManagementDepartment);
router.get('/:id',managementDepartmentController.getSingleManagementDepartment);
router.delete('/:id',managementDepartmentController.deleteManagementDepartment);
router.put('/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),managementDepartmentController.updateManagementDepartment)


export const managementDepartmentRouter = router