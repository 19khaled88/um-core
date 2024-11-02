import express from "express";

import validationRequest from "../../middlewares/validationRequest";

import { academicDepartmentController } from "./controller";
import { AcademicDepartmentValiation } from "./validation";

const router = express.Router();

router.post(
  "/create",
  validationRequest(AcademicDepartmentValiation.createDepartmentZodSchema),
  academicDepartmentController.createAcademicDepartment
);
router.get("/all", academicDepartmentController.getAllAcademicDepartment);
router.get("/:id", academicDepartmentController.getSingleAcademicDepartment);
router.put(
  "/:id",
  validationRequest(AcademicDepartmentValiation.updateDepartmentZodSchema),
  academicDepartmentController.updateAcademicDepartment
);
router.delete("/:id", academicDepartmentController.deleteAcademicDepartment);

export const academicDepartmentRoutes = router;
