import express from "express";
import {academicSemesterRoutes} from '../app/modules/academicSemester/route'
import { academicfacultyRoutes } from "../app/modules/academicfaculty/route";



const router  = express.Router();

const moduleRoutes = [
    {
        path:'/academic-semester/',
        route:academicSemesterRoutes
    },{
        path:'/academic-faculty/',
        route:academicfacultyRoutes
    }
];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


export default router;