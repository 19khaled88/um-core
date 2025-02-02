import { RedisClient } from "../../../shared/redis"
import { EVENT_STUDENT_CREATED, EVENT_STUDENT_DELETED, EVENT_STUDENT_UPDATED } from "./contants"
import { transformResponseToStudentCreatedEvent } from "./interface";
import { studentServices } from "./service";

const initStudentEvents =() =>{
    RedisClient.subscribe(EVENT_STUDENT_CREATED,async(e:string)=>{
        const data = JSON.parse(e);
        const studentCreatedFormatedEvent = transformResponseToStudentCreatedEvent(data)
        await studentServices.create_Student_From_Events(studentCreatedFormatedEvent);
    })

    RedisClient.subscribe(EVENT_STUDENT_UPDATED,async(e:string)=>{
        const data = JSON.parse(e);
        await studentServices.updated_student_From_Events(data);
    })

    RedisClient.subscribe(EVENT_STUDENT_DELETED,async(e:string)=>{
        const data = JSON.parse(e);
        await studentServices.delete_student_from_event(data)
        
    })
}

export default initStudentEvents