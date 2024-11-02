import express from "express";

import validationRequest from "../../middlewares/validationRequest";

import { academicfacultyController } from "./controller";
import { AcademicFacultyValiation } from "./validation";

const router = express.Router();

router.post(
  "/create",
  validationRequest(AcademicFacultyValiation.createFacultyZodSchema),
  academicfacultyController.createAcademicFaculty
);
router.get("/all", academicfacultyController.getAllAcademicFaculties);
router.get("/:id", academicfacultyController.getSingleAcademicFaculty);
router.put(
  "/:id",
  validationRequest(AcademicFacultyValiation.updateFacultyZodSchema),
  academicfacultyController.updateAcademicFaculty
);
router.delete("/:id", academicfacultyController.deleteAcademicFaculty);

export const academicfacultyRoutes = router;
