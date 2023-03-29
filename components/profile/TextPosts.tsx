import { useEffect, useState } from "react";
import FetchedUserObj from "../../types/FetchedUserTypes";
import FetchedProfile from "../../types/FetchedProfile";
import FetchedPost from "../../types/FetchedPost";
import PostCard from "../PostCard";
import cookie from "js-cookie";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";

type TextPostProps = {
  viewingUser: FetchedUserObj | null;
  profileObj: FetchedProfile;
};

const TextPosts = (props: TextPostProps) => {
  const [posts, setPosts] = useState<FetchedPost[] | null>(null);
  const [clickedPostId, setClickedPostId] = useState<string | null>(null);

  useEffect(() => {
    const Token = cookie.get("Token");
    axios
      .get("/api/posts/", { headers: { authorization: Token } })
      .then((res) => {
        res.data = res.data.filter((e: FetchedPost) => e.picUrl === "");
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [posts]);

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {posts ? (
        posts.map((post, index) => {
          return <PostCard post={post} user={props.viewingUser} key={index} />;
        })
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};
export default TextPosts;
