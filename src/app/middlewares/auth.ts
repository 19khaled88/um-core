import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helper/jwtHelper";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../config";

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
     
      
      // let token = req.headers.authorization;
      let token = req.headers["authorization"]
      
      if (!token) {
        token = req.cookies.refreshtoken;
      }
      
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Not authorized");
      }
      
      let verifiedToken = null;
      try {
        verifiedToken = jwt.verify(token, config.jwt.token as Secret);
        
      } catch (error) {
  
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid token");
      }

      
      
      // Type guard to check that verifiedToken is a JwtPayload
      if (typeof verifiedToken !== "string" && "role" in verifiedToken) {
        // Check if the user's role is authorized
        if (!roles.includes(verifiedToken.role)) {
          throw new ApiError(httpStatus.FORBIDDEN, "Insufficient permissions");
        }

        // Attach user info to request and proceed
        req.user = verifiedToken;
        
        next();
      } else {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid token format");
      }
    } catch (error) {
      next(error);
    }
  };

  
export default auth;



