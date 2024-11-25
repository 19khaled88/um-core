import express from "express";
import {academicSemesterRoutes} from '../app/modules/academicSemester/route'
import { academicfacultyRoutes } from "../app/modules/academicfaculty/route";
import { academicDepartmentRoutes } from "../app/modules/academicDepartment/route";
import { userRoutes } from "../app/modules/User/router";
import { managementDepartmentRouter } from "../app/modules/managementDepartment/router";
import { studentRouter } from "../app/modules/Student/router";
import { authRoutes } from "../app/modules/Auth/router";
import { buildingRoutes } from "../app/modules/building/router";
import { roomRoutes } from "../app/modules/room/router";
import { courseRoutes } from "../app/modules/course/router";
import { semester_registration_routes } from "../app/modules/semesterRegistration/router";
import { offeredCourseRoutes } from "../app/modules/offeredCourse/router";



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
    },
    {
        path:'/auth',
        route:authRoutes
    },
    {
        path:'/building',
        route:buildingRoutes
    },
    {
        path:'/room',
        route:roomRoutes
    },
    {
        path:'/course',
        route:courseRoutes
    },
    {
        path:'/semesterRegistration',
        route:semester_registration_routes
    },
    {
        path:'/offeredCourse',
        route:offeredCourseRoutes
    }

];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


export default router;