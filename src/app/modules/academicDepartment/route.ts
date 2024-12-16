import express from "express";

import validationRequest from "../../middlewares/validationRequest";

import { academicDepartmentController } from "./controller";
import { AcademicDepartmentValiation } from "./validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  validationRequest(AcademicDepartmentValiation.createDepartmentZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  academicDepartmentController.createAcademicDepartment
);
router.get("/all", academicDepartmentController.getAllAcademicDepartment);
router.get("/:id", academicDepartmentController.getSingleAcademicDepartment);
router.put(
  "/:id",
  validationRequest(AcademicDepartmentValiation.updateDepartmentZodSchema),
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  academicDepartmentController.updateAcademicDepartment
);
router.delete(
  "/:id",
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  academicDepartmentController.deleteAcademicDepartment
);

export const academicDepartmentRoutes = router;
