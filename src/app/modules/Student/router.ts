
import express from 'express'
import { studentController } from './controller'


const router = express.Router()


router.get('/all',studentController.getAllStudent);
router.get('/:id',studentController.getSingleStudent);
router.delete('/:id',studentController.deleteStudent);
router.put('/:id',studentController.updateStudent)


export const studentRouter = router