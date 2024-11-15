

import experss from 'express'
import { userController } from './controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

const router = experss.Router()


router.post('/create-student',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),userController.createStudent);
router.post('/create-faculty',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),userController.createFaculty);

export const userRoutes = router