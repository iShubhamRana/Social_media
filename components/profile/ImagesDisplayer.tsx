import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModalWrapper from "../ModalWrapper";
import axios from "axios";
import cookie from "js-cookie";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import FetchedPost from "../../types/FetchedPost";
import { Types } from "mongoose";
import PostModal from "../PostModal";
import FetchedUserObj from "../../types/FetchedUserTypes";
import FetchedProfile from "../../types/FetchedProfile";

type ImagesDisplayerProps = {
  viewingUser: FetchedUserObj | null;
  profileObj: FetchedProfile;
};

const ImagesDisplayer = (props: ImagesDisplayerProps) => {
  const [posts, setPosts] = useState<FetchedPost[] | null>(null);
  const [clickedPostId, setClickedPostId] = useState<string | null>(null);

  useEffect(() => {
    const Token = cookie.get("Token");
    axios
      .get("/api/posts/", { headers: { authorization: Token } })
      .then((res) => {
        res.data = res.data.filter((e: FetchedPost) => e.picUrl !== "");
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleMoreInfo = (post: FetchedPost) => {
    window.scroll({ top: 0 });
    setClickedPostId(post._id);
  };

  return (
    <>
      {clickedPostId && (
        <ModalWrapper
          setVisibility={() => {
            setClickedPostId(null);
          }}
        >
          <PostModal postId={clickedPostId} user={props.viewingUser} />
        </ModalWrapper>
      )}
      <ImageList
        sx={{ width: "100%", height: "fit-content" }}
        cols={3}
        rowHeight={300}
        gap={50}
      >
        {!posts && <CircularProgress />}{" "}
        {posts &&
          posts.map((item) => {
            return (
              <ImageListItem key={item.picUrl}>
                <img
                  src={item.picUrl}
                  srcSet={item.picUrl}
                  alt={item.text}
                  loading="lazy"
                  style={{ height: "100%", width: "100%" }}
                />
                <ImageListItemBar
                  title={item.text}
                  subtitle={item.user.username}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about`}
                      onClick={() => {
                        handleMoreInfo(item);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            );
          })}
      </ImageList>
    </>
  );
};

export default ImagesDisplayer;
