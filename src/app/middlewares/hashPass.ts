import { PrismaClient } from "@prisma/client";
import bcrpt from "bcrypt";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const hashPrisma = new PrismaClient();

hashPrisma.$use(async (params, next) => {
  if (
    params.model === "User" &&
    (params.action === "create" || params.action === "update")
  ) {
    const userData = params.args?.data;

    if (userData?.password) {
      try {
        const saltRounds = Number(config.bcyrpt_salt_rounds) || 10;
        userData.password = await bcrpt.hash(userData.password, saltRounds);
      } catch (error) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Failed to hash the password, Please try again"
        );
      }
    }
  }

  return next(params);
});




export default hashPrisma;
