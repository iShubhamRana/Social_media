import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import RequestObj from "../types/express/RequestObj";
import { Types } from "mongoose";

const authMiddleMare = async (
  req: RequestObj,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send("Token not present");
    }
    const user = jwt.verify(req.headers.authorization, "shubham");

    req["userId"] = (user as JwtPayload).userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

export default authMiddleMare;
