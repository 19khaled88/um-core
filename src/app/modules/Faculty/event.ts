import { RedisClient } from "../../../shared/redis"
import { EVENT_FACULTY_CREATED, EVENT_FACULTY_DELETED, EVENT_FACULTY_UPDATED } from "./constants"
import { FacultyCreatedEvent, transformResponseToFacultyCreatedEvent } from "./interface";
import { facultyService } from "./service";


const initFacultyEvents =()=>{
    RedisClient.subscribe(EVENT_FACULTY_CREATED,async(e:string)=>{
        // const data:FacultyCreatedEvent = JSON.parse(e);
        const data = JSON.parse(e);
        const facultyCreatedFormatedEvent = transformResponseToFacultyCreatedEvent(data)
        
        await facultyService.createFacultyFromEvent(facultyCreatedFormatedEvent);
    })
    RedisClient.subscribe(EVENT_FACULTY_UPDATED,async(e:string)=>{
        const data = JSON.parse(e);
        await facultyService.updateFacultyFromEvent(data); 
    })
    RedisClient.subscribe(EVENT_FACULTY_DELETED,async(e:string)=>{
        const data = JSON.parse(e);
        await facultyService.deleteFacultyFromEvent(data)
    })
}


export default initFacultyEvents;