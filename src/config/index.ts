import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.join(process.cwd(),'.env')})


export default {
    env:process.env.NODE_ENV,
    port:process.env.PORT,
    db_url:process.env.DATABASE_URL,
    default_st_pass:process.env.DEFAULT_STD_PASS,
    default_faculty_pass:process.env.DEFAULT_FACLTY_PASS,
    bcyrpt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
    jwt:{
        token:process.env.JWT_SECRET,
        token_expire:process.env.JWT_EXPIRES_IN,
        refresh_token:process.env.JWT_REFRESH_SECRET,
        refresh_token_expire:process.env.JWT_REFRESH_EXPIRES_IN,
    },
    redis:{
        redisAuthClient:process.env.REDIS_URL,
        expires_in:process.env.REDIS_TOKEN_EXPIRES_IN
    }
}