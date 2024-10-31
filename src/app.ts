import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './router/index';
import httpStatus from 'http-status';
const app:Application = express();

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



//application routes
// app.use('/api/v1/users/',userRoutes)
// app.use('/api/v1/academicSemester',academicSemesterRoutes)
app.use('/api/v1/',router)

app.get('/',async(req:Request,res:Response,next:NextFunction)=>{
    Promise.reject(new Error('Unhandled Promise Rejection'))
    // next(new Error('Unhandled Promise Rejection'));
});


//global error handler
app.use(globalErrorHandler)


//handle not found
app.use((req,res,next)=>{
    res.status(httpStatus.NOT_FOUND).json({
        success:false,
        message:'Not found',
        errorMessages:[{
            path:req.originalUrl,
            message:'API Not Found'
        }]
    })
    next()
})
export default app;