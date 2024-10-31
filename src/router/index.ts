import express from "express";
import { userRoutes } from "../app/modules/faculty/router";




const router  = express.Router();

const moduleRoutes = [
    {
        path:'/users/',
        route:userRoutes
    },
    

    
];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


// router.use('/users/',userRoutes)
// router.use('/academicSemester/',academicSemesterRoutes)


export default router;