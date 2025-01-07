import { RedisClient } from "../../../shared/redis"
import { EVENT_STUDENT_CREATED } from "./contants"
import { studentServices } from "./service";

const initStudentEvents =() =>{
    RedisClient.subscribe(EVENT_STUDENT_CREATED,async(e:string)=>{
        const data = JSON.parse(e);
        await studentServices.create_Student_From_Events(data);
    })
}

export default initStudentEvents