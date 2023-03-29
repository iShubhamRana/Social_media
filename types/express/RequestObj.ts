import { Request } from "express";
import { Types } from "mongoose";

interface RequestObj extends Request {
  userId?: Types.ObjectId;
}
export default RequestObj;
