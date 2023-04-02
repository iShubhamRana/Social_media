import PostModal from "../../components/PostModal";
import Box from "@mui/material/Box";
import FetchedUserObj from "../../types/FetchedUserTypes";
import PostModalLoading from "../../components/PostModalLoadingSkeleton";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import fetchUser from "../../utilsServer/fetchUser";

const PostId = () => {
  const [viewingUser, setViewingUser] = useState<FetchedUserObj | null>(null);
  const router = useRouter();

  const { postId } = router.query;

  useEffect(() => {}, [router.query]);
  useEffect(() => {
    fetchUser().then((res) => {
      setViewingUser(res);
    });
  }, []);

  console.log(postId);
  return (
    <Box
      sx={{
        width: "90vw",
        height: "60vh",
        // border: "1px solid black",
        position: "relative",
      }}
    >
      {!postId && <PostModalLoading />}
      {postId && <PostModal user={viewingUser} postId={postId as string} />}
    </Box>
  );
};

export default PostId;
