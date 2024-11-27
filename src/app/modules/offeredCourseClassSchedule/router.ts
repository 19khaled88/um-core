import express from "express";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { offeredCourseClassScheduleController } from "./controller";


const router = express.Router();

router.post(
  "/create-offered-course-section",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  offeredCourseClassScheduleController.create
);
router.get(
  "/all",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  offeredCourseClassScheduleController.getAllClassSchedule
);

export const offeredCourseClassScheduleRoutes = router;
