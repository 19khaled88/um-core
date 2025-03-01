import { RedisClient } from "../../../shared/redis"
import { EVENT_SUPER_ADMIN_CREATED } from "./constants";
import { transformResponseToSuperAdminCreatedEvent } from "./interface";
import { superAdminServices } from "./services";
// import { studentServices } from "./service";

const initSupserAdminEvents =() =>{
    RedisClient.subscribe(EVENT_SUPER_ADMIN_CREATED,async(e:string)=>{
        const data = JSON.parse(e);
        
        const superAdminCreatedFormatedEvent = transformResponseToSuperAdminCreatedEvent(data)
        
        await superAdminServices.create_super_admin_from_events(superAdminCreatedFormatedEvent);
    })

    // RedisClient.subscribe(EVENT_STUDENT_UPDATED,async(e:string)=>{
    //     const data = JSON.parse(e);
    //     await studentServices.updated_student_From_Events(data);
    // })

    // RedisClient.subscribe(EVENT_STUDENT_DELETED,async(e:string)=>{
    //     const data = JSON.parse(e);
    //     await studentServices.delete_student_from_event(data)
        
    // })
}

export default initSupserAdminEvents