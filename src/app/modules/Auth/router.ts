import express from "express";
import validationRequest from "../../middlewares/validationRequest";

import { authController } from "./controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { AuthValidation } from "./validation";
const router = express.Router();


router.post("/refresh-token", authController.refreshToken);
router.post("/login", validationRequest(AuthValidation.loginZodSchema),authController.login);
router.post(
  "/chanage-password",
  validationRequest(AuthValidation.changePasswordZodSchema),
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  authController.changePassword
);

export const authRoutes = router;
