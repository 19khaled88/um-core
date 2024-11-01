import express from "express";
import { academicSemesterController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { AcademicSemesterValidation } from "./validation";

const router = express.Router();

router.post(
  "/create",
  validationRequest(AcademicSemesterValidation.academicSemesterZodSchema),
  academicSemesterController.createAcademicSemester
);
router.get("/all", academicSemesterController.getAllSemesters);
router.get("/:id", academicSemesterController.getSingleSemester);
router.put(
  "/:id",
  validationRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
  academicSemesterController.updateSemester
);
router.delete("/:id", academicSemesterController.deleteSemester);

export const academicSemesterRoutes = router;
