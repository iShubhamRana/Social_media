import express, { Request, Response } from "express";
import RequestObj from "../types/express/RequestObj";
import authMiddleMare from "../middleware/authMiddleware";
import PostObj from "../types/PostType";
import PostModel from "../models/PostModel";
import commentObj from "../types/commentType";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {
  newCommentNotification,
  newLikeNotification,
} from "../utilsServer/notificationAction";
const router = express.Router();

//create a post

router.post("/", authMiddleMare, async (req: RequestObj, res: Response) => {
  const post: PostObj = req.body.post;
  post.text = post.text.trim();

  if (post.text.length < 1)
    return res.status(401).send("Text must be 1 character");

  try {
    const newPost = new PostModel(post).save();
    return res.status(200).json(newPost);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
});

//get a post by id
router.get(
  "/:postId",
  authMiddleMare,
  async (req: RequestObj, res: Response) => {
    try {
      const { postId } = req.params;
      const post = await PostModel.findById(postId)
        .populate("user")
        .populate("comments.user");
      if (!post) return res.status(402).send("Post not found");

      return res.status(200).send(post);
    } catch (err) {}
  }
);

//get all posts
router.get("/", authMiddleMare, async (req: RequestObj, res: Response) => {
  try {
    //sort in descending

    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 4;

    let posts;
    if (number == 1) {
      posts = await PostModel.find()
        .limit(4)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("comments.user");
    } else {
      const skips = size * (number - 1);
      posts = await PostModel.find()
        .skip(skips)
        .limit(size)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("comments.user");
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).send("Error fetching posts");
  }
});

//like a post
router.post(
  "/like/:postId",
  authMiddleMare,
  async (req: RequestObj, res: Response) => {
    try {
      const { postId } = req.params;
      const { userId } = req;
      const post = await PostModel.findById(postId);
      if (!post) return res.status(402).send("Invalid postid");
      const isLiked =
        post.likes.filter((like) => like._id.equals(userId as Types.ObjectId))
          .length > 0;

      if (isLiked) {
        post.likes = post.likes.filter(
          (like) => !like._id.equals(userId as Types.ObjectId)
        );
        await post.save();
      } else {
        post.likes.push(userId as Types.ObjectId);
        await post.save();
        if (!post.user.equals(userId as Types.ObjectId)) {
          console.log("dont do")
          await newLikeNotification(
            userId as Types.ObjectId,
            post._id,
            post.user
          );
        }
      }

      return res.status(200).send("Action completed");
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);


//comment on a post
router.post(
  "/comment/:postId",
  authMiddleMare,
  async (req: RequestObj, res: Response) => {
    try {
      const { postId } = req.params;
      const { userId } = req;
      const { text } = req.body;
      if (text.length < 1) return res.status(401).send("Invalid comment");

      const post = await PostModel.findById(postId);
      if (!post) return res.status(404).send("Invalid Post");

      const newComment: commentObj = {
        _id: uuidv4(),
        text: text,
        user: userId as Types.ObjectId,
        date: Date.now(),
      };

      post.comments.unshift(newComment);
      await post.save();

      if (!post.user.equals(userId as Types.ObjectId)) {
        await newCommentNotification(
          userId as Types.ObjectId,
          post._id,
          post.user,
          newComment._id,
          text
        );
      }

      return res.status(200).send("Comment Added");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server Error");
    }
  }
);

//delete a comment
router.delete(
  "/:postId/:commentId",
  authMiddleMare,
  async (req: RequestObj, res: Response) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = req;

      const post = await PostModel.findById(postId);
      if (!post) return res.status(404).send("Invalid Post");

      post.comments = post.comments.filter(
        (comment) => comment._id !== commentId
      );
      await post.save();
      return res.status(200).send("Comment deleted");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
