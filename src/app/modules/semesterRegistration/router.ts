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

export const semester_registration_routes = router;
