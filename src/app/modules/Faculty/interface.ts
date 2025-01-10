

export type FacultyCreatedEvent = {
    id: string; 
    name: {
      firstName: string;
      lastName: string;
      middleName: string;  
    };
    dateOfBirth: string;
    profileImage: string;  
    email: string;
    contactNo: string;
    gender: string;
    bloodGroup: string; 
    designation: string;
    academicDepartment: {
      syncId: string;
    };
    academicFaculty: {
      syncId: string;
    };
    emergencyContactNo: string; 
    presentAddress: string;
    permanentAddress: string;
  };
  