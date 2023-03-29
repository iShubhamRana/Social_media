import FetchedPostObj from "../types/FetchedPost";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import FetchedUserObj from "../types/FetchedUserTypes";
import baseUrl from "../utilsServer/base";
import { red } from "@mui/material/colors";
import cookie from "js-cookie";
import axios from "axios";
import PostModalLoadingSkeleton from "./PostModalLoadingSkeleton";
import calculateTime from "../utilsServer/calculateTime";
import Router from "next/router";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Message from "../types/MessageType";
import SnackBar from "./SnackBar";

type PostcardProps = {
  postId: string;
  user: FetchedUserObj | null;
};

type CommentProps = {
  comment: {
    _id: string;
    user: FetchedUserObj;
    text: string;
    date: Date;
  };
  user: FetchedUserObj | null;
  deleteComment: (comment_id: string) => void;
};

const CommentDisplayer = (props: CommentProps) => {
  return (
    <Card sx={{ maxWidth: "100%", boxShadow: "none" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], cursor: "pointer" }}
            aria-label="recipe"
            src={props.comment.user.profilePicUrl}
            onClick={() => {
              Router.push(`/${props.comment.user.username}`);
            }}
          ></Avatar>
        }
        action={
          <IconButton aria-label="settings">
            {props.user &&
              (props.comment.user._id === props.user._id ||
                props.user.role == "root") && (
                <DeleteIcon
                  onClick={() => {
                    props.deleteComment(props.comment._id);
                  }}
                />
              )}
          </IconButton>
        }
        title={
          props.comment.user.username +
          " " +
          calculateTime(new Date(props.comment.date))
        }
        subheader={props.comment.text}
      />
    </Card>
  );
};

const PostModal = (props: PostcardProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [post, setPost] = useState<FetchedPostObj | null>(null);
  const [likes, setLikes] = useState<number>(0);

  const [showSnackbar, setShowSnackbar] = useState<boolean | undefined>(false);
  const [message, setMessage] = useState<Message>({
    message: "",
    type: "success",
  });

  const fetchPost = () => {
    const Token = cookie.get("Token");

    axios
      .get(`${baseUrl}/api/posts/${props.postId}`, {
        headers: { authorization: Token },
      })
      .then((res) => {
        setPost(res.data);
        const check = (res.data as FetchedPostObj).likes.find(
          (some_user) => some_user._id === props.user?._id
        );
        if (check) setIsLiked(true);
        setLikes(res.data.likes.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleLike = () => {
    if (!props.user) {
      setShowSnackbar(true);
      setMessage({
        message: "Login to perform this action",
        type: "error",
      });
      return;
    }
    setIsLiked((prev) => !prev);
    if (isLiked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    const Token = cookie.get("Token");
    axios
      .post(
        `${baseUrl}/api/posts/like/${post?._id}`,
        {},
        {
          headers: { authorization: Token },
        }
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleComment = () => {
    if (!props.user) {
      setShowSnackbar(true);
      setMessage({
        message: "Login to perform this action",
        type: "error",
      });
      return;
    }
    const text = comment;
    const Token = cookie.get("Token");
    axios
      .post(
        `${baseUrl}/api/posts/comment/${post?._id}`,
        {
          text,
        },
        {
          headers: { authorization: Token },
        }
      )
      .then((res) => {
        setComment("");
        fetchPost();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (comment_id: string) => {
    const post_id = post?._id;
    setPost(null);
    const Token = cookie.get("Token");
    axios
      .delete(`${baseUrl}/api/posts/${post_id}/${comment_id}`, {
        headers: {
          authorization: Token,
        },
      })
      .then(async (res) => {
        fetchPost();
        setShowSnackbar(true);
        setMessage({
          message: "Comment deleted successfully",
          type: "success",
        });
      })
      .catch((err) => {
        fetchPost();
      });
  };

  const pushToPost = () => {};

  const handleShowSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };

  return (
    <>
      <SnackBar
        open={showSnackbar}
        handlerFunction={handleShowSnackbar}
        message={message.message}
        behaviour={message.type}
      />
      <Box
        sx={{
          width: "60%",
          boxShadow: "0px 0px 2px black",
          zIndex: 1000,
          position: "absolute",
          left: "20%",
          height: "70%",
          top: "15%",
          display: "flex",
        }}
        // id="parent"
        component="div"
      >
        {post ? (
          <>
            <Card
              sx={{
                width: "60%",
                ml: "auto",
                mr: "auto",
                height: "100%",
                boxShadow: "0px 0px 2px black",
              }}
              style={{ fontSize: "20px" }}
            >
              {" "}
              <CardHeader
                sx={{ height: "3rem" }}
                avatar={<Avatar alt="Ted talk" src={post.user.profilePicUrl} />}
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={post.user.username}
                subheader={
                  post.user.name +
                  (post.location !== "" ? " is at " + post.location : "")
                }
              />
              {post.picUrl && (
                <CardMedia
                  component="img"
                  onDoubleClick={handleLike}
                  //   height="500px"
                  image={post.picUrl}
                  alt="Nicola Sturgeon on a TED talk stage"
                  sx={{
                    ml: "auto",
                    mr: "auto",
                    height: "30rem",
                    cursor: "pointer",
                  }}
                />
              )}
              <CardContent sx={{ height: "70px" }}>
                <Typography
                  variant="body2"
                  color="text.primary"
                  component="p"
                  fontSize={"15px"}
                >
                  {post.text}
                </Typography>
                <Box component="div">
                  <Box component="div" sx={{ p: 0 }}>
                    <IconButton aria-label="likebutton" onClick={handleLike}>
                      {isLiked ? (
                        <FavoriteIcon
                          fontSize="medium"
                          sx={{ color: red[500] }}
                        />
                      ) : (
                        <FavoriteBorderIcon fontSize="medium" />
                      )}
                      <Typography> {likes}</Typography>
                    </IconButton>
                    <IconButton aria-label="commentbutton">
                      <ChatBubbleOutlineIcon fontSize="medium" />
                      <Typography sx={{ pl: 1 }}>
                        {" "}
                        {post.comments.length}
                      </Typography>
                    </IconButton>
                    <IconButton aria-label="sharebutton">
                      <TelegramIcon fontSize="medium" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <div
              style={{
                width: "40%",
                boxShadow: "0px 0px 2px black",
                background: "white",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "90%",
                  overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                {post.comments.map((comment) => {
                  return (
                    <CommentDisplayer
                      comment={comment}
                      user={props.user}
                      deleteComment={deleteComment}
                    />
                  );
                })}
              </div>

              <div
                style={{
                  width: "100%",
                  height: "10%",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <input
                  value={comment}
                  style={{ width: "80%", border: "none" }}
                  placeholder="Add Comment"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <Button
                  style={{ width: "20%" }}
                  variant="outlined"
                  onClick={handleComment}
                >
                  Comment
                </Button>
              </div>
            </div>
          </>
        ) : (
          <PostModalLoadingSkeleton />
        )}
      </Box>
    </>
  );
};
export default PostModal;
