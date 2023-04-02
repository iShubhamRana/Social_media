import React, { useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
import Container from "@mui/material/Container";
import withAuth from "../utilsServer/withAuth";
import Layout from "../components/Layout";
import CreatePost from "../components/CreatePost";
import FetchedPostObj from "../types/FetchedPost";
import Box from "@mui/material/Box";
import axios from "axios";
import cookie from "js-cookie";
import Postcard from "../components/PostCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import FetchedUserObj from "../types/FetchedUserTypes";
import baseUrl from "../utilsServer/base";
import useNewMessageModel from "../customhooks/useNewMessage";
import ModalWrapper from "../components/ModalWrapper";
import NewMessageModel from "../components/NewMessageModel";
import { useSocket } from "../contexts/SocketContext";

type HomeProps = ProtectedRouteProps;

export default function Home(props: HomeProps) {
  const [posts, setPosts] = useState<FetchedPostObj[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const socket = useSocket().socket.socket;

  const {
    showNewMessageModel,
    newMessageContent,
    setShowNewMessageModel,
    setNewMessageContent,
  } = useNewMessageModel();

  const Token = cookie.get("Token");

  //for scrolling
  // if (window) {
  //   window.scroll = function () {
  //     console.log("hi");
  //   };
  // }

  const bottomReachDetector = () => {
    var totalPageHeight = document.body.scrollHeight;

    var scrollPoint = window.scrollY + window.innerHeight;

    if (scrollPoint >= totalPageHeight) {
      setPageNumber((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.onscroll = bottomReachDetector;

    document.title = `Welcome, ${props.user?.name.split(" ")[0]}`;
    setFetching(true);

    if (socket) {
      socket.emit("join", { userId: props.user?._id as string });
      socket.on("newMessageReceived", (data) => {
        const { message, chatWith, chatWith_username, chatWith_profilePic } =
          data;
        if (props.user?.newMessagePopup) {
          setNewMessageContent({
            message: message,
            userInfo: {
              id: chatWith,
              username: chatWith_username,
              profilepic: chatWith_profilePic,
            },
          });
          setShowNewMessageModel(true);
        }
      });
    }

    return () => {
      socket.off("newMessageReceived");
    };
  }, [socket]);

  useEffect(() => {
    setFetching(true);
    //turn of eventlisteneing when fetching
    window.removeEventListener("onscroll", bottomReachDetector);

    axios
      .get(`${baseUrl}/api/posts/`, {
        headers: { authorization: Token },
        params: { pageNumber: pageNumber },
      })
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data]);
        setFetching(false);
      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          window.onscroll = bottomReachDetector;
        }, 2000);
        setFetching(false);
      });
  }, [pageNumber]);

  const handleMoreInfoIcon = () => {};

  return (
    <Layout {...props}>
      {showNewMessageModel && (
        <ModalWrapper setVisibility={setShowNewMessageModel}>
          <NewMessageModel
            {...newMessageContent}
            socket={socket}
            user={props.user as FetchedUserObj}
            turnOff={() => {
              setShowNewMessageModel(false);
            }}
          />
        </ModalWrapper>
      )}
      <Container sx={{ width: "100% " }}>
        <CreatePost {...props} />

        <Box
          component="div"
          sx={{
            width: "85%",
            borderRadius: "10px",
            mt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 1.5,
            justifyContent: "center",
            // m:"auto"
            // ml: 1.5,
          }}
        >
          {posts.length &&
            posts.map((post, index) => {
              return (
                <Postcard
                  post={post}
                  user={props.user as FetchedUserObj}
                  key={index}
                />
              );
            })}
          {fetching && <LoadingSkeleton />}
        </Box>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    return { props: {} };
  }
);
