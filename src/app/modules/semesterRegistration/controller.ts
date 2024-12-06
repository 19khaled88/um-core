import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import { semesterRegistrationService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import { searchAndFilterableFields } from "../../../constants/semesterRegistration";
import { paginationFields } from "../../../constants/pagination";

const createSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.createSemesterRegistration(req.body);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester created successfully",
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "Semester registration not created";
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: false,
        message: errorMessage,
        data: null,
      });
    }
  }
);

const startNewSemester = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.startNewSemester(req.params.id);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester newly started successfully",
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "Semester commencement gone to be failed";
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: false,
        message: errorMessage,
        data: null,
      });
    }
  }
);

const getAllSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const filters = pick(req.query, searchAndFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);
      const result =
        await semesterRegistrationService.getAllSemesterRegistrations(
          filters,
          paginationOptions
        );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "",
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "Failed to get Semester Registrations";
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: errorMessage,
        data: null,
      });
    }
  }
);

const getSinglSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.getSingleSemesterRegistration(
          req.params.id
        );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single semester registration found!",
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : "Semester registration not found for given ID";
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: errorMessage,
        data: null,
      });
    }
  }
);

const deleteSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.deleteSemesterRegistration(
          req.params.id
        );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester registration deleted for given ID!",
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Semester registration not deleted",
        data: null,
      });
    }
  }
);

const updateSemesterRegistration = catchAsnc(
  async (req: Request, res: Response) => {
    try {
      const result =
        await semesterRegistrationService.updateSemesterRegistration(
          req.params.id,
          req.body
        );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Semester registration updated for given ID!",
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Semester registration not updated",
        data: null,
      });
    }
  }
);

const registerToNewSemester = catchAsnc(async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await semesterRegistrationService.registerToNewSemester(
      user.role,
      user.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Registration to new semester successful!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Registration to new semester unsuccessful!",
      data: null,
    });
  }
});

const enrollCourse = catchAsnc(async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await semesterRegistrationService.enrollIntoCourse(
      user.role,
      user.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Registration to new course successful!",
      data: result,
    });
  } catch (error) {
    
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Registration to new course unsuccessful!",
      data: null,
    });
  }
});

const withdrawCourse = catchAsnc(async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await semesterRegistrationService.withdrawCourse(
      user.role,
      user.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Course withdrawn successfully!",
      data: result,
    });
  } catch (error) {
    
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Course withdraw unsuccessful!",
      data: null,
    });
  }
});

const confirmRegistration = catchAsnc(async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await semesterRegistrationService.confirmRegistration(
      // user.role,
      user.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Registration confirmed successfully!",
      data: result,
    });
  } catch (error) {
   
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Registration not confirmed!",
      data: null,
    });
  }
});

const getMyRegistrations = catchAsnc(async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await semesterRegistrationService.getMyRegistrations(
      user.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ongoing registrations retrieved successfully!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "No onging registration found!",
      data: null,
    });
  }
});

const updateStudentMarks = catchAsnc(async(req:Request,res:Response)=>{
  try {
    const result = await semesterRegistrationService.updateStudentMarks(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student marks updated successfully!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Marks update not successful!",
      data: null,
    });
  }
})

const updateFinalMarks = catchAsnc(async(req:Request,res:Response)=>{
  try {
    const result = await semesterRegistrationService.updateFinalMarks(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Final marks updated successfully!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Marks update not successful!",
      data: null,
    });
  }
})

const getMySemesterRegisteredCourses=catchAsnc(async(req:Request,res:Response)=>{
  try {
    const user = (req as any).user;
    const result = await semesterRegistrationService.getMySemesterRegisteredCourses(
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Registered courses fetched successfully!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "No registered course found",
      data: null,
    });
  }
})

export const semesterRegistrationController = {
  createSemesterRegistration,
  startNewSemester,
  getAllSemesterRegistration,
  getSinglSemesterRegistration,
  deleteSemesterRegistration,
  updateSemesterRegistration,
  registerToNewSemester,
  enrollCourse,
  withdrawCourse,
  confirmRegistration,
  getMyRegistrations,
  updateStudentMarks,
  updateFinalMarks,
  getMySemesterRegisteredCourses
};
