import express from "express";
import {academicSemesterRoutes} from '../app/modules/academicSemester/route'
import { academicfacultyRoutes } from "../app/modules/academicfaculty/route";
import { academicDepartmentRoutes } from "../app/modules/academicDepartment/route";
import { userRoutes } from "../app/modules/User/router";
import { managementDepartmentRouter } from "../app/modules/managementDepartment/router";
import { studentRouter } from "../app/modules/Student/router";



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
    },
    {
        path:'/users',
        route:userRoutes
    },
    {
        path:'managementDepartment',
        route:managementDepartmentRouter
    },
    {
        path:'/students',
        route:studentRouter
    }

];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


export default router;