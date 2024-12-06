import express from 'express'
import { facultyControllter } from './controller'

const router = express.Router()



router.get('/get-my-course',facultyControllter.myCourses)


export const facultyRoutes = router