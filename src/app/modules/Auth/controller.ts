import { NextFunction, Response, Request } from "express"
import catchAsnc from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import httpStatus from "http-status"

import config from "../../../config"
import { authService } from "./services"
import { LoginResponse } from "./interface"



const login = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {...loginData} = req.body
        const result = await authService.login(loginData)
        const {refreshToken, ...others} = result
        const cookieOptions ={
            secure:config.env === 'production',
            httpOnly:true
        }
        res.cookie('refreshtoken',refreshToken,cookieOptions)
        sendResponse<LoginResponse>(res,{
        statusCode:httpStatus.OK,
        success:false,
        message:'Login successful',
        data:others
        })
      
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:'Login failed',
            data:null
        })
    }
})


const refreshToken = catchAsnc(async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {...data} = req.cookies
        const result = await authService.refreshToken(data.refreshtoken)
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:false,
            message:'refresh token created',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:'token not found',
            data:null
        })
    }
});


// First time user login password change 
const changePassword = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const { ...userInfo } = await isJwtPayloadWithRole(req.user);
        const {...passwords} = req.body;
        const ifPasswrdChange = await authService.changePassword(passwords,userInfo)

        // const result = await authSerivce.login({...passwords,userInfo})
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Password changed successfully',
            data:ifPasswrdChange
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.NOT_FOUND,
            success:true,
            message:'Password not changed!',
            data:null
        })
    }
})




async function isJwtPayloadWithRole(user: any): Promise<{ userId: string; role: string }> {
    return new Promise((resolve, reject) => {
        if (user && typeof user.id === 'string' && typeof user.role === 'string') {
            resolve({ userId: user.id, role: user.role });
        } else {
            reject(new Error('Invalid user payload'));
        }
    });
}

export const authController ={
    login,
    refreshToken,
    changePassword
}