


export type SuperAdminCreatedEvent = {
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
    isSuperAdmin: boolean;
    designation: string;
    managementDepartmentId: string;
    permissions:string[];
    emergencyContactNo: string;
    presentAddress: string;
    permanentAddress: string;
    syncId: string;
  };
  
  // export const transformResponseToSuperAdminCreatedEvent = (
  //   response: any
  // ): SuperAdminCreatedEvent => {
  //   return {
  //     id: response.id,
  //     name: {
  //       firstName: response.name.firstName,
  //       lastName: response.name.lastName,
  //       middleName: response.name.middleName,
  //     },
  //     dateOfBirth: response.dateOfBirth,
  //     profileImage: response.profileImage,
  //     email: response.email,
  //     contactNo: response.contactNo,
  //     gender: response.gender,
  //     bloodGroup: response.bloodGroup,
  //     managementDepartmentId: response.managementDepartment.id,
  //     permissions:response.permissions,
  //     designation: response.designation,
  //     isSuperAdmin:response.isSuperAdmin,
  //     emergencyContactNo: response.emergencyContactNo,
  //     presentAddress: response.presentAddress,
  //     permanentAddress: response.permanentAddress,
  //     syncId: response._id,
  //   };
  // };






  export const transformResponseToSuperAdminCreatedEvent = (
    response: any
  ): SuperAdminCreatedEvent => {
    return {
      id: response.id,
      name: {
        firstName: response.superAdmin.name.firstName,
        lastName: response.superAdmin.name.lastName,
        middleName: response.superAdmin.name.middleName,
      },
      dateOfBirth: response.superAdmin.dateOfBirth,
      profileImage: response.superAdmin.profileImage || "", // Default empty string if missing
      email: response.superAdmin.email,
      contactNo: response.superAdmin.contactNo,
      gender: response.superAdmin.gender,
      bloodGroup: response.superAdmin.bloodGroup,
      managementDepartmentId: response.superAdmin.managementDepartment.id,
      permissions: response.superAdmin.permissions,
      designation: response.superAdmin.designation,
      isSuperAdmin: response.superAdmin.isSuperAdmin,
      emergencyContactNo: response.superAdmin.emergencyContactNo,
      presentAddress: response.superAdmin.presentAddress,
      permanentAddress: response.superAdmin.permanentAddress,
      syncId: response.superAdmin._id, // Using `superAdmin._id` instead of top-level `_id`
    };
  };
  
  export type SuperAdminCreateResponse = {
    success: boolean;
  };
  