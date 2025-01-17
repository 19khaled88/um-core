import initFacultyEvents from "../modules/Faculty/event";
import initStudentEvents from "../modules/Student/events"

const subscribeToEvents = () =>{
    initStudentEvents();
    initFacultyEvents();
}

export default subscribeToEvents