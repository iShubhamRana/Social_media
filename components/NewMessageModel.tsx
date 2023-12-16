import React, { useState, useEffect } from "react";
import { FetchedMessage } from "../types/MessageModalType";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ChatMessage from "./chats/ChatMessage";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import TelegramIcon from "@mui/icons-material/Telegram";
import IconButton from "@mui/material/IconButton";
import { io, Socket } from "socket.io-client";
import FetchedUserObj from "../types/FetchedUserTypes";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tooltip from "@mui/material/Tooltip";
import Router from "next/router";

import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../socket/socketEvents";

type newMessageContentType = {
  message: FetchedMessage;
  userInfo: {
    id: string;
    username: string;
    profilepic: string;
  };
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  user: FetchedUserObj;
  turnOff:()=>void
};

const NewMessageModel = (props: newMessageContentType) => {
  const [messages, setMessages] = useState<FetchedMessage[]>([]); //all the messages that were sent onreply
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (props.socket) {
      props.socket.on("messageSent", (data) => {
        setMessages((prev) => [...prev, data.message]);
      });
    }

    return () => {
      if (props.socket) {
        props.socket.off("messageSent");
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!props.socket) return;

    props.socket.emit("sendMessage", {
      owner: props.user._id,
      chatWith: props.userInfo.id,
      text: message,
      username: props.user.username,
      profilepic: props.user.profilePicUrl,
    });

    setMessage("");
    setTimeout(()=>{
      props.turnOff();
    },2000)
  };

  return (
    <Box
      sx={{
        width: "30%",
        boxShadow: "0px 0px 2px black",
        zIndex: 1000,
        position: "absolute",
        left: "30%",
        height: "20%",
        top: "30%",
        background: "white",
        borderRadius: "10px",
      }}
    >
      <Card sx={{ width: "100%", borderRadius: "10px" }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: "black" }}
              src={props.userInfo.profilepic}
              aria-label="recipe"
            ></Avatar>
          }
          action={
            <Tooltip title="Check inbox">
              <IconButton
                aria-label="settings"
                onClick={() => {
                  Router.push("/messages");
                }}
              >
                <ExitToAppIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          }
          title={
            <Typography
              component={"h5"}
            >{`${props.userInfo.username} sent you a message`}</Typography>
          }
        />
        <ChatMessage
          messageId={props.message._id}
          text={props.message.msg}
          profilePic={props.userInfo.profilepic}
          wasSent={false}
          date={props.message.date}
        />

        {messages.map((currMessage , key) => {
          return (
            <ChatMessage
            key={key}
              messageId={currMessage._id}
              text={currMessage.msg}
              profilePic={""}
              wasSent={true}
              date={currMessage.date}
            />
          );
        })}
        <form
          style={{ width: "100%", height: "fit-content" }}
          onSubmit={handleSubmit}
        >
          <TextField
            type="text"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMessage(e.target.value);
            }}
            sx={{ height: "50%", width: "100%", m: 0, p: 0 }}
            placeholder={"Reply"}
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
      </Card>
    </Box>
  );
};

export default NewMessageModel;
