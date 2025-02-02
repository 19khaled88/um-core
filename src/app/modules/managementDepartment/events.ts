import { RedisClient } from "../../../shared/redis";
import { EVENT_MANAGEMENT_DEPARTMENT_CREATED, EVENT_MANAGEMENT_DEPARTMENT_DELETED, EVENT_MANAGEMENT_DEPARTMENT_UPDATED } from "./constants";
import { IMnagementDepartmentEvents } from "./interface";
import { managementDepartmentService } from "./service";


const initManagementDepartmentEvents =()=>{
    RedisClient.subscribe(EVENT_MANAGEMENT_DEPARTMENT_CREATED,async(e:string)=>{
        // const data:FacultyCreatedEvent = JSON.parse(e);
        const data:IMnagementDepartmentEvents = JSON.parse(e);
        await managementDepartmentService.createManagementDepartmentFromEvents(data);
    })
    RedisClient.subscribe(EVENT_MANAGEMENT_DEPARTMENT_UPDATED,async(e:string)=>{
        const data:IMnagementDepartmentEvents = JSON.parse(e);
        await managementDepartmentService.updateManagementDepartmentFromEvents(data); 
    })
    RedisClient.subscribe(EVENT_MANAGEMENT_DEPARTMENT_DELETED,async(e:string)=>{
        const data:IMnagementDepartmentEvents = JSON.parse(e);
        await managementDepartmentService.deleteManagementDepartmentFromEvents(data)
    })
}


export default initManagementDepartmentEvents;