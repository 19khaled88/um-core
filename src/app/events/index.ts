import initFacultyEvents from "../modules/Faculty/event";
import initManagementDepartmentEvents from "../modules/managementDepartment/events";
import initStudentEvents from "../modules/Student/events"
import initSupserAdminEvents from "../modules/Super-admin/events";

const subscribeToEvents = () =>{
    initStudentEvents();
    initFacultyEvents();
    initManagementDepartmentEvents();
    initSupserAdminEvents();
}

export default subscribeToEvents