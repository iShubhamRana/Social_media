import FetchedPostObj from "../types/FetchedPost";
import React, { useCallback, useEffect, useState } from "react";
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
import ModalWrapper from "./ModalWrapper";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import FetchedUserObj from "../types/FetchedUserTypes";
import baseUrl from "../utilsServer/base";
import { red } from "@mui/material/colors";
import cookie from "js-cookie";
import axios from "axios";
import PostModal from "./PostModal";

type PostcardProps = {
  post: FetchedPostObj;
  user: FetchedUserObj | null;
  key: number;
};

const PostCard = (props: PostcardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    const check = props.post.likes.find(
      (some_user) => some_user._id === props.user?._id
    );
    if (check) setIsLiked(true);
  }, []);

  const handleLike = useCallback(() => {
    setIsLiked((prev) => !prev);

    const Token = cookie.get("Token");
    axios
      .post(
        `${baseUrl}/api/posts/like/${props.post._id}`,
        {},
        {
          headers: { authorization: Token },
        }
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const pushToPost = useCallback(() => {
    window.scroll({ top: 0 });
    setShowModal(true);
  }, []);

  return (
    <>
      {showModal && (
        <ModalWrapper setVisibility={setShowModal}>
          <PostModal postId={props.post._id} user={props.user} />
        </ModalWrapper>
      )}
      <Card
        sx={{
          width: "100%",
          height: "fit-content",
          p: 2,
          borderRadius: "10px",
          border: "1px solid lightgrey",
          mb: 2,
        }}
        style={{ fontSize: "20px" }}
        elevation={2}
      >
        {" "}
        <CardHeader
          sx={{ height: "3rem", mb: 1 }}
          avatar={<Avatar alt="Ted talk" src={props.post.user.profilePicUrl} />}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.post.user.username}
          subheader={
            props.post.user.name +
            (props.post.location !== "" ? " is at " + props.post.location : "")
          }
        />
        {props.post.picUrl && (
          <CardMedia
            component="img"
            onDoubleClick={handleLike}
            //   height="500px"
            image={props.post.picUrl}
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
            {props.post.text}
          </Typography>
          <Box component="div">
            <Box component="div" sx={{ p: 0 }}>
              <IconButton aria-label="likebutton" onClick={handleLike}>
                {isLiked ? (
                  <FavoriteIcon fontSize="medium" sx={{ color: red[500] }} />
                ) : (
                  <FavoriteBorderIcon fontSize="medium" />
                )}
              </IconButton>
              <IconButton aria-label="commentbutton" onClick={pushToPost}>
                <ChatBubbleOutlineIcon fontSize="medium" />
              </IconButton>
              <IconButton aria-label="sharebutton" onClick={pushToPost}>
                <TelegramIcon fontSize="medium" />
              </IconButton>
            </Box>
          </Box>
          <input
            style={{ border: "none" }}
            placeholder="Add Comment"
            onClick={pushToPost}
          />
        </CardContent>
      </Card>
    </>
  );
};
export default PostCard;
