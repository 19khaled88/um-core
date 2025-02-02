import initFacultyEvents from "../modules/Faculty/event";
import initManagementDepartmentEvents from "../modules/managementDepartment/events";
import initStudentEvents from "../modules/Student/events"

const subscribeToEvents = () =>{
    initStudentEvents();
    initFacultyEvents();
    initManagementDepartmentEvents();
}

export default subscribeToEvents