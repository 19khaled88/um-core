import express from "express";
import {academicSemesterRoutes} from '../app/modules/academicSemester/route'
import { academicfacultyRoutes } from "../app/modules/academicfaculty/route";
import { academicDepartmentRoutes } from "../app/modules/academicDepartment/route";



const router  = express.Router();

const moduleRoutes = [
    {
        path:'/academic-semester/',
        route:academicSemesterRoutes
    },{
        path:'/academic-faculty/',
        route:academicfacultyRoutes
    },
    {
        path:'/academic-department/',
        route:academicDepartmentRoutes
    }
];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


export default router;