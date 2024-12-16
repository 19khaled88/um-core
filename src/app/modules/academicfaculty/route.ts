import express from "express";

import validationRequest from "../../middlewares/validationRequest";

import { academicfacultyController } from "./controller";
import { AcademicFacultyValiation } from "./validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  validationRequest(AcademicFacultyValiation.createFacultyZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  academicfacultyController.createAcademicFaculty
);
router.get("/all", academicfacultyController.getAllAcademicFaculties);
router.get("/:id", academicfacultyController.getSingleAcademicFaculty);
router.put(
  "/:id",
  validationRequest(AcademicFacultyValiation.updateFacultyZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  academicfacultyController.updateAcademicFaculty
);
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  academicfacultyController.deleteAcademicFaculty
);

export const academicfacultyRoutes = router;
