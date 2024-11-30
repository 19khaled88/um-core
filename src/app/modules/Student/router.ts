import express from "express";
import { studentController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { StudentZodValidation } from "./validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get("/all", studentController.getAllStudent);
router.get("/:id", studentController.getSingleStudent);
router.get(
  "/mycourse/:id",
  auth(ENUM_USER_ROLE.STUDENT),
  studentController.myCourses
);
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  studentController.deleteStudent
);
router.put(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(StudentZodValidation.updateStudentZodSchema),
  studentController.updateStudent
);

export const studentRouter = router;
