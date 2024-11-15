
import express from 'express'
import { managementDepartmentController } from './controller'


const router = express.Router()


router.post('/create-management-department',managementDepartmentController.createManagementDepartment);
router.get('/all',managementDepartmentController.getAllManagementDepartment);
router.get('/:id',managementDepartmentController.getSingleManagementDepartment);
router.delete('/:id',managementDepartmentController.deleteManagementDepartment);
router.put('/:id',managementDepartmentController.updateManagementDepartment)


export const managementDepartmentRouter = router