import express from "express";
import { offeredCourseController } from "./controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validationRequest from "../../middlewares/validationRequest";
import { OfferedCoursesValidation } from "./validation";

const router = express.Router();

router.post(
  "/create-offered-course",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validationRequest(OfferedCoursesValidation.createOfferedCourseZodSchema),
  offeredCourseController.createOfferedCourse
);

export const offeredCourseRoutes = router;
