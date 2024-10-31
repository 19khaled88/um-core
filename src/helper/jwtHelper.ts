import jwt, {Secret} from 'jsonwebtoken';


const creatToken=(payload:Record<string,unknown>,secret:Secret,expires:string):string=>{
    return jwt.sign(payload,secret,{expiresIn:expires})
}

export const jwtHelpers = {
    creatToken
}