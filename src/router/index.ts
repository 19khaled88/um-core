import express from "express";
import { userRoutes } from "../app/modules/faculty/router";
import {academicSemesterRoutes} from '../app/modules/academicSemester/route'



const router  = express.Router();

const moduleRoutes = [
    {
        path:'/academic-semester/',
        route:academicSemesterRoutes
    }
    

    
];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


// router.use('/users/',userRoutes)
// router.use('/academicSemester/',academicSemesterRoutes)


export default router;