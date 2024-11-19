import express from "express";
import { roomController } from "./controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validationRequest from "../../middlewares/validationRequest";
import { RoomValidation } from "./validation";

const router = express.Router();

router.post(
  "/create-room",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(RoomValidation.createRoomZodSchema),
  roomController.createRoom
);
router.get(
  "/all",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  roomController.getAllRoom
);
router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  roomController.getSinglRoom
);
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  roomController.deleteRoom
);
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validationRequest(RoomValidation.updateRoomZodSchema),
  roomController.updateRoom
);

export const roomRoutes = router;
