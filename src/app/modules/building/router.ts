import express from "express";
import { buildingController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { BuildingValidation } from "./validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create-building",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(BuildingValidation.createBuildingZodSchema),
  buildingController.createBuilding
);
router.get(
  "/all",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  buildingController.getAllBuilding
);
router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  buildingController.getSingleBuilding
);
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  buildingController.deleteBuilding
);
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(BuildingValidation.updateBuildingZodSchema),
  buildingController.updateBuilding
);

export const buildingRoutes = router;
