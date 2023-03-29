import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import UserModel from "../models/UserModel";
import crypto from "crypto";
import bcrypt from "bcrypt";
import baseUrl from "../utilsServer/base";

require("dotenv").config();
const router = express.Router();

const options = {
  auth: {
    api_key: process.env.SENDGRID_API as string,
  },
};

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(401).send("invalid email");
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(402).send("Invalid email");
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.expireToken = Date.now();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const href = `${baseUrl}/reset/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email.toLowerCase(),
      subject: "Password reset",
      html: `<p>Click on this link to reset the password . Only valid for 60 minutes</p><a href=${href}>Link</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => console.log(err));

    await user.save();
    return res.status(200).send("Token sent successfully");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.post("/token", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    if (password.length < 6) {
      return res.status(401).send("Unauthorized");
    }

    const user = await UserModel.findOne({ resetToken: token });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // console.log(user.expireToken , Date.now())

    if (Date.now() < (user.expireToken as number)) {
      return res.status(401).send("TOken expired , generate a new one");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = "";
    user.expireToken = undefined;
    await user.save();

    return res.status(200).send("Password updated");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
