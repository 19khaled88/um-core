import express from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validationRequest from "../../middlewares/validationRequest";
import { courseController } from "./controller";
import { CourseValidation } from "./validation";

const router = express.Router();

router.post(
  "/create-course",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(CourseValidation.createCourseZodSchema),
  courseController.createCourse
);
router.get(
  "/all",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  courseController.getAllCourse
);
router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  courseController.singleCourse
);
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  courseController.deleteCourse
);
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(CourseValidation.updateCourseZodSchema),
  courseController.updateCourse
);
router.post(
  "/:id/assign_course_faculty",
  validationRequest(CourseValidation.assignOrRemoveCourse),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  courseController.assignFaculty
);
router.delete(
  "/:id/remove_course_faculty",
  validationRequest(CourseValidation.assignOrRemoveCourse),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  courseController.removeFaculty
);

export const courseRoutes = router;
