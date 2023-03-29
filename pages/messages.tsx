import React, { ReactNode, useEffect, useRef } from "react";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
import withAuth from "../utilsServer/withAuth";
import Layout from "../components/Layout";
import axios from "axios";
import { useState } from "react";
import baseUrl from "../utilsServer/base";
import cookie from "js-cookie";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import ChatInfoType from "../types/ChatInfoType";
import ChatInfoDiplayer from "../components/chats/ChatInfoDisplayer";
import ChatBox from "../components/chats/ChatBox";
import List from "@mui/material/List";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import { useSocket } from "../contexts/SocketContext";
import FetchedUserObj from "../types/FetchedUserTypes";

type MessageProps = ProtectedRouteProps;

type connectedUserType = { userId: string; socketId: string };

const Messages = (props: MessageProps) => {
  const [chats, setChats] = useState<ChatInfoType[] | null>(null);
  const router = useRouter();
  const [isfetching, setFetching] = useState<boolean>(true);

  const [connectedUsers, setConnectedUsers] = useState<connectedUserType[]>([]);
  const socket = useSocket().socket.socket;

  const openChatId = useRef("");

  useEffect(() => {
    document.title = `Messages`;
    const Token = cookie.get("Token");

    axios
      .get(`${baseUrl}/api/messages/getAllChats`, {
        headers: {
          Authorization: Token,
        },
      })
      .then((res) => {
        setFetching(false);
        setChats(res.data);
        if (res.data.length) {
          router.push(
            `/messages/?message=${res.data[0].chatWith_id}`,
            undefined,
            {
              shallow: true,
            }
          );
        }
      })
      .catch((err) => {
        setFetching(false);
      });

    //socket work

    if (props.user) {
      socket.emit("join", { userId: props.user._id as string });
    }
    socket.on("connectedUsers", (data) => {
      setConnectedUsers(data.users);
    });

    socket.emit("markMessagesRead", {
      userId: props.user?._id as string,
    });

    // });

    socket.on("deleteChatSuccessful", (data) => {
      setFetching(false);
      const { chatWith } = data;
      setChats((prev) => {
        if (!prev) return prev;
        const filteredChats = prev.filter(
          (chat) => !(chat.chatWith_id === chatWith)
        );
        router.push("/messages");
        return filteredChats;
      });
    });

    socket.on("newMessageReceived", async (data) => {
      const { chatWith, message, chatWith_profilePic, chatWith_username } =
        data;
      setChats((prev) => {
        if (!prev) return prev;
        const found = prev.find((chat) => chat.chatWith_id === chatWith);
        //if the chat already exists , update else add a new chat
        if (found) {
          found.lastMessage = message.msg;
          return [...prev];
        } else {
          const newChat = {
            chat_id: "",
            chatWith_id: chatWith,
            chatWith_username: chatWith_username,
            chatWith_profilePicUrl: chatWith_profilePic,
            lastMessage: message.msg,
            hasUnreadMessage: true,
            date: message.date,
          };
          prev.unshift(newChat);
          return [...prev];
        }
      });
    });

    //chat info work

    return () => {
      socket.emit("markMessagesRead", {
        userId: props.user?._id as string,
      });
      socket.emit("disconnectUser");
      socket.off("connectedUsers");
      socket.off("newMessageReceived");
      socket.off("deleteChatSuccessful");
    };
  }, []);

  const handleChatDelete = (owner: string, chatWith: string) => {
    setFetching(true);
    socket.emit("deleteChat", { owner, chatWith });
  };

  return (
    <Layout {...props}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Paper
          sx={{
            width: "90%",
            mt: 5,
            textAlign: "center",
            display: "flex",
            height: "70vh",
            border: "1px solid lightgrey",
            justifyContent: "center",
            alignItems: "center",
          }}
          // elevation={1}
        >
          {isfetching && !chats && <CircularProgress />}
          {chats && (
            <>
              <List
                sx={{
                  width: "30%",
                  height: "100%",
                  borderRight: "1px solid lightgrey",
                  overflowY: "auto",
                  p: 0,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "left",
                    p: 2,
                    fontWeight: "600",
                    color: "#1976d2",
                    borderBottom: "1px solid lightgrey",
                    // textShadow:"0 0 0.5px #1976d2"
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MapsUgcIcon fontSize="large" />
                  Messages
                </Typography>

                {chats.map((chat, index) => {
                  return (
                    <ChatInfoDiplayer
                      chat={chat}
                      key={index}
                      index={index}
                      isOnline={
                        connectedUsers.find(
                          (user) => user.userId === chat.chatWith_id
                        ) !== undefined
                      }
                    />
                  );
                })}
              </List>
              <Box sx={{ width: "70%", height: "100%" }}>
                <ChatBox
                  socket={socket}
                  user={props.user as FetchedUserObj}
                  isFetching={isfetching}
                  isOnline={
                    connectedUsers.find(
                      (user) => user.userId === (router.query.message as string)
                    ) !== undefined
                  }
                  handleChatDelete={handleChatDelete}
                />
              </Box>
            </>
          )}
          {/* {chats && !chats.length && (
            <Typography
              variant="h4"
              sx={{
                height: "100%",
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                fontWeight: "500",
                color: "#1976d2",
              }}
            >
              <MapsUgcIcon fontSize="large" style={{ fontSize: "100px" }} />
              No messages
            </Typography>
          )} */}
        </Paper>
      </Box>
    </Layout>
  );
};

export default Messages;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    return { props: {} };
  }
);
