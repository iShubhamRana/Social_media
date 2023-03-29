import express, { Request, Response } from "express";
import UserModal from "../models/UserModel";
import RequestObj from "../types/express/RequestObj";
import authMiddleMare from "../middleware/authMiddleware";
import FollowerModel from "../models/FollowerModel";
import UserObj from "../types/UserType";
const router = express.Router();

router.get(
  "/searchuser/:searchText",
  authMiddleMare,
  async (req: RequestObj, res: Response) => {
    let { searchText } = req.params;
    searchText = searchText.trim();
    let foundUsers: UserObj[] = [];
    if (searchText.length == 0) return res.status(200).json(foundUsers);
    try {
      let regexExp = new RegExp(`^${searchText}`);
      const results = await UserModal.find({
        username: { $regex: regexExp, $options: "i" },
      });

      return res.status(200).json(results);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
