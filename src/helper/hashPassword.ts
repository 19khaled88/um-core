
import bcrypt from "bcrypt";

import httpStatus from "http-status";
import config from "../config";
import ApiError from "../errors/ApiError";

const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = Number(config.bcyrpt_salt_rounds) || 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to hash the password, Please try again"
    );
  }
};

export const passWordSecurity= {
    hashPassword
}
