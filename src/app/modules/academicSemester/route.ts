import express from "express";
import { academicSemesterController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { AcademicSemesterValidation } from "./validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create",
  validationRequest(AcademicSemesterValidation.academicSemesterZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  academicSemesterController.createAcademicSemester
);
router.get("/all", academicSemesterController.getAllSemesters);
router.get("/:id", academicSemesterController.getSingleSemester);
router.put(
  "/:id",
  validationRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.ADMIN),
  academicSemesterController.updateSemester
);
router.delete("/:id", academicSemesterController.deleteSemester);

export const academicSemesterRoutes = router;
