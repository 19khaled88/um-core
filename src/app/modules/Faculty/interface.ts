

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
    syncId:string;
};

export const transformResponseToFacultyCreatedEvent = (response: any): FacultyCreatedEvent => {
    return {
      id: response.faculty.id,
      name: {
        firstName: response.faculty.name.firstName,
        lastName: response.faculty.name.lastName,
        middleName: response.faculty.name.middleName,
      },
      dateOfBirth: response.faculty.dateOfBirth,
      profileImage: response.faculty.profileImage,
      email: response.faculty.email,
      contactNo: response.faculty.contactNo,
      gender: response.faculty.gender,
      bloodGroup: response.faculty.bloodGroup,
      designation: response.faculty.designation,
      academicDepartment: {
        syncId: response.faculty.academicDepartment.syncId,
      },
      academicFaculty: {
        syncId: response.faculty.academicFaculty.syncId,
      },
      emergencyContactNo: response.faculty.emergencyContactNo,
      presentAddress: response.faculty.presentAddress,
      permanentAddress: response.faculty.permanentAddress,
      syncId:response.faculty._id,
    };
};
  