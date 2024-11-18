import { Prisma, PrismaClient } from "@prisma/client"
import { IAuth, IChngePassword } from "./interface"
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import verifyPassword from "../../middlewares/verifyPassword";
import config from "../../../config";
import { jwtHelpers } from "../../../helper/jwtHelper";

import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { passWordSecurity } from "../../../helper/hashPassword";

const prisma = new PrismaClient()

const login = async(payload:IAuth)=>{
    const { userId, password } = payload;
   
    let isUserExist;
    switch(true){
        case userId.startsWith('22'):
            isUserExist = await prisma.student.findFirst({
                where:{
                    studentId:userId
                }
            });

            break; 

        // case userId.startsWith("admin-"): // Example for admin ID
        //     isUserExist = await prisma.admin.findFirst({
        //         where: { studentId:userId },
        //     });
        //     break;
    
        // case userId.startsWith("faculty-"): // Example for faculty ID
        //     isUserExist = await prisma.faculty.findFirst({
        //         where: { studentId:userId },
        //     });
        //     break;
    }
    
   
    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const checkUser = await prisma.user.findFirst({
        where:{studentId:isUserExist?.id}
    })

   
    if(!checkUser){
        throw new ApiError(httpStatus.NOT_FOUND, "This user data not found");
    }

    const isPasswordCorrect = await verifyPassword(password,checkUser.password)

    if(!isPasswordCorrect){
        throw new ApiError(httpStatus.NOT_FOUND, "Invalid password!");
    }

    if (!config.jwt.token || !config.jwt.token_expire) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Secret code or expiry time not found"
        );
    }
    
    const accessToken = jwtHelpers.creatToken(
    { id: isUserExist.id, role: checkUser.role },
    config.jwt.token as Secret,
    config.jwt.token_expire as string
    );

    const refreshToken = jwtHelpers.creatToken(
    { id: isUserExist.id, role: checkUser.role },
    config.jwt.refresh_token as Secret,
    config.jwt.refresh_token_expire as string
    );

    return {
    accessToken,refreshToken,isNeededPassChange:checkUser.needsPassChange !== undefined ? checkUser.needsPassChange : false
    }

}

const refreshToken = async(token:string)=>{
    let verifiedToken = null
    
    try {
        verifiedToken = jwt.verify(token,config.jwt.refresh_token as Secret) as JwtPayload;
        
    } catch (error) {
        throw new ApiError(httpStatus.FORBIDDEN,'Invalid refresh token')
    }

    const {id, role} = verifiedToken;


    const isUserExist = await prisma.user.findFirst({
        where:{studentId:id}
    })
    
    if(!isUserExist){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    //generate new token
    const newAccessToken = jwtHelpers.creatToken(
        {id:isUserExist.id,role:isUserExist.role},
        config.jwt.token as Secret, config.jwt.token_expire as string
    )

    return {
        token:newAccessToken
    }
}

const changePassword = async(passwords:IChngePassword,payload:JwtPayload):Promise<void>=>{
    const {oldPassword,newPassword} = passwords
    const {userId} = payload
    let isUserExist;
    switch(true){
        case userId.startsWith('22'):
            isUserExist = await prisma.student.findFirst({
                where:{
                    studentId:userId
                }
            });

            break; 

    }
     
    if(!isUserExist){
      throw new ApiError(httpStatus.NOT_FOUND,'User does not exist')
    }
  
    const checkUser = await prisma.user.findFirst({
        where:{studentId:isUserExist?.id}
    })

   
    if(!checkUser){
        throw new ApiError(httpStatus.NOT_FOUND, "This user data not found");
    }



    if(checkUser.password && !(await verifyPassword(oldPassword,checkUser.password))){
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect')
    }
  
    // const newHassPass = await byct.hash(newPassword, Number(config.bcyrpt_salt_rounds))
   const newHassPass = await passWordSecurity.hashPassword(oldPassword)
    const changeData ={ 
      password:newHassPass,
      needsPassChange:false,
      passwordChangedAt:new Date()
    }
  
    // await User.findOneAndUpdate({id:payload?.userId},changeData)
    await prisma.user.update({
        where:{
           studentId:checkUser.id 
        },
        data:changeData
    })
  
  }
export const authService = {
    login,
    refreshToken,
    changePassword
}