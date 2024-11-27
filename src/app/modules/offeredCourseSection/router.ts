import express from "express";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { offeredCourseSectionController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { OfferedCoursesSectionValidation } from "./validation";

const router = express.Router();

router.post(
  "/create-offered-course-section",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validationRequest(
    OfferedCoursesSectionValidation.createOfferedCourseSectionZodSchema
  ),
  offeredCourseSectionController.createOfferedCourseSection
);

export const offeredCourseSectionRoutes = router;
