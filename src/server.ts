import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import {successLogger,errorLogger} from "./shared/logger/logger";
import {Server} from 'http'



process.on('uncaughtException',err=>{
    errorLogger.error(err)
    process.exit(1)
})

let server:Server;

async function dbConn(){
    
    try {
        await mongoose.connect(config.db_url as string)
        successLogger.info('Database connected successfully')

       server = app.listen(config.port,()=>{
            successLogger.info(`connection established on ${config.port}`)
        })
    } catch (error) {
        errorLogger.error('Database connection failed')
    }

    process.on('unhandledRejection',(err)=>{
        if(server){
            server.close(()=>{
                errorLogger.error(err)
                process.exit(1)
            })
        }else{
            process.exit(1)
        }
    })
}

dbConn();


process.on('SIGTERM',()=>{
    successLogger.info('SIGTERM is received')
    if(server){
        server.close()
    }
})

