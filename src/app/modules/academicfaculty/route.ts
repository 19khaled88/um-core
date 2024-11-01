import express from "express";

import validationRequest from "../../middlewares/validationRequest";

import { academicfacultyController } from "./controller";
import { AcademicFacultyValiation } from "./validation";

const router = express.Router();

router.post(
  "/create",
  validationRequest(AcademicFacultyValiation.createFacultyZodSchema),
  academicfacultyController.createFaculty
);
router.get("/all", academicfacultyController.getAllFaculties);
router.get("/:id", academicfacultyController.getSingleFaculty);
router.put(
  "/:id",
  validationRequest(AcademicFacultyValiation.updateFacultyZodSchema),
  academicfacultyController.updateFaculty
);
router.delete("/:id", academicfacultyController.deleteFaculty);

export const academicfacultyRoutes = router;
