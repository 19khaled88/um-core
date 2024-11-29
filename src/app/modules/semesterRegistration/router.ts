import express from "express";
import { semesterRegistrationController } from "./controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validationRequest from "../../middlewares/validationRequest";
import { SemesterRegistrationValidation } from "./validation";

const router = express.Router();

router.post(
  "/create-semester-registration",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(
    SemesterRegistrationValidation.createSemesterRegistrationZodSchema
  ),
  semesterRegistrationController.createSemesterRegistration
);

router.post(
  "/start/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(
    SemesterRegistrationValidation.semesterCommencementZodSchema
  ),
  semesterRegistrationController.startNewSemester
);

router.post(
  "/start-semester-registration",
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.registerToNewSemester
);

router.get(
  "/all",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  semesterRegistrationController.getAllSemesterRegistration
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  semesterRegistrationController.getSinglSemesterRegistration
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  semesterRegistrationController.deleteSemesterRegistration
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationZodSchema
  ),
  semesterRegistrationController.updateSemesterRegistration
);

router.post(
  "/enroll-cousre",
  auth(ENUM_USER_ROLE.STUDENT),
  validationRequest(
    SemesterRegistrationValidation.enrollOrWithdrawCourseZodSchema
  ),
  semesterRegistrationController.enrollCourse
);

router.post(
  "/withdraw-course",
  auth(ENUM_USER_ROLE.STUDENT),
  validationRequest(
    SemesterRegistrationValidation.enrollOrWithdrawCourseZodSchema
  ),
  semesterRegistrationController.withdrawCourse
);

router.post(
  "/confirm-registration",
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.confirmRegistration
);
router.get(
  "/myregistration",
  auth(ENUM_USER_ROLE.STUDENT),
  semesterRegistrationController.getMyRegistrations
);

export const semester_registration_routes = router;
