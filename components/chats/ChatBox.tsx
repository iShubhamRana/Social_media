import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import { Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../socket/socketEvents";
import FetchedUserObj from "../../types/FetchedUserTypes";
import { FetchedMessage } from "../../types/MessageModalType";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import TelegramIcon from "@mui/icons-material/Telegram";
import ChatMessage from "./ChatMessage";
import { useRouter } from "next/router";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import CircularProgress from "@mui/material/CircularProgress";

type ChatBoxProps = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  user: FetchedUserObj;
  isOnline: boolean;
  handleChatDelete: (owner: string, chatWith: string) => void;
  isFetching: boolean;
};

const ChatBox = ({
  socket,
  user,
  isOnline,
  handleChatDelete,
  isFetching,
}: ChatBoxProps) => {

  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<FetchedMessage[]>([]);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    profilepic: string;
  }>({ username: "", profilepic: "" });

  const divRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (divref: React.RefObject<HTMLDivElement | null>) => {
    if (divref.current) {
      divref.current.scrollIntoView({ behavior: "smooth" });
      divref.current.scrollTop = divref.current.scrollHeight;
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (socket && router.query.message) {
      socket.emit("loadMessages", {
        owner: user._id,
        chatWith: router.query.message as string,
      });
    }

    if (socket) {
      socket.on("messagesLoaded", (data) => {
        setChatMessages(data.chat.messages.map((msg) => msg.message));
        setUserInfo({
          username: data.chat.chatWith.username,
          profilepic: data.chat.chatWith.profilePicUrl,
        });
      });

      socket.on("messageSent", (data) => {
        setChatMessages((prev) => [...prev, data.message]);
      });

      socket.on("updateChatBox", (data) => {
        if (router.query.message === data.chatWith) {
          setChatMessages((prev) => [...prev, data.message]);
        }
      });

      socket.on("msgDeleteSuccessful", (data) => {
        setChatMessages((prev) =>
          prev.filter((msg) => msg._id !== data.messageId)
        );
      });
    }

    return () => {
      if (socket) {
        if (router.query.message) {
          socket.emit("markRead", {
            owner: user._id,
            chatWith: router.query.message as string,
          });
        }
        socket.off("messageSent");
        socket.off("messagesLoaded");
        socket.off("updateChatBox");
        socket.off("msgDeleteSuccessful");
      }
    };
  }, [router.query.message]);

  useEffect(() => {
    scrollToBottom(divRef);
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket) return;

    socket.emit("sendMessage", {
      owner: user._id,
      chatWith: router.query.message as string,
      text: message,
      username: user.username,
      profilepic: user.profilePicUrl,
    });

    setMessage("");
  };

  const handleMessageDelete = (messageId: string) => {
    if (!socket) return;
    socket.emit("deleteMessage", {
      owner: user._id,
      chatWith: router.query.message as string,
      messageId: messageId,
    });
  };

  if (!router.query.message) {
    return (
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
        Message friends
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Card
        sx={{
          width: "100%",
          textAlign: "left",
          height: "12%",
          boxShadow: "none",
          borderBottom: "1px solid lightgrey",
        }}
      >
        <CardHeader
          avatar={
            <Badge
              color="success"
              variant="dot"
              invisible={!isOnline}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              sx={{ cursor: "pointer" }}
            >
              <Avatar
                sx={{ bgcolor: "black" }}
                aria-label="recipe"
                src={userInfo.profilepic}
                onClick={() => {
                  router.push(`/${userInfo.username}`);
                }}
              ></Avatar>
            </Badge>
          }
          action={
            !isFetching ? (
              <IconButton aria-label="settings">
                <DeleteIcon
                  onClick={() => {
                    handleChatDelete(user._id, router.query.message as string);
                  }}
                />
                {/* )} */}
              </IconButton>
            ) : (
              <IconButton aria-label="settings">
               <CircularProgress />
              </IconButton>
            )
          }
          title={
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => {
                router.push(`/${userInfo.username}`);
              }}
            >
              {userInfo.username}
            </Typography>
          }
          subheader={isOnline ? "active now" : "offline"}
        />
      </Card>
      <Box
        sx={{ overflow: "auto", height: "78%" }}
        component="div"
        ref={divRef}
        style={{ scrollbarWidth: "thin" }}
      >
        {chatMessages.map((message) => {
          return (
            <ChatMessage
              messageId={message._id}
              text={message.msg}
              profilePic={userInfo.profilepic}
              wasSent={user._id === message.sender}
              date={message.date}
              handleMessageDelete={handleMessageDelete}
            ></ChatMessage>
          );
        })}
      </Box>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TextField
          type="text"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(e.target.value);
          }}
          sx={{ height: "50%", width: "95%", m: 0, p: 0 }}
          placeholder={"Send message"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton type="submit" disabled={!message}>
                  <TelegramIcon
                    color={message ? "primary" : "disabled"}
                    fontSize="large"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Box>
  );
};

export default ChatBox;
