import React, { useState, useEffect, useRef } from "react";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
import withAuth from "../utilsServer/withAuth";
import Layout from "../components/Layout";
import axios from "axios";
import baseUrl from "../utilsServer/base";
import cookie from "js-cookie";
import { NotificationElement } from "../types/FetchedNotificationType";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import useNewMessageModel from "../customhooks/useNewMessage";

import NewFollowNotification from "../components/notifications/NewFollowNotification";
import NewCommentNotification from "../components/notifications/NewCommentNotification";
import NewLikeNotification from "../components/notifications/NewLikeNotification";
import NewMessageModel from "../components/NewMessageModel";
import { useSocket } from "../contexts/SocketContext";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ModalWrapper from "../components/ModalWrapper";
import FetchedUserObj from "../types/FetchedUserTypes";

type NotificationProps = ProtectedRouteProps;

const Notifications = (props: NotificationProps) => {
  const [notifications, setNotifications] = useState<
    NotificationElement[] | null
  >(null);

  const socket = useSocket().socket.socket;

  const {
    showNewMessageModel,
    newMessageContent,
    setShowNewMessageModel,
    setNewMessageContent,
  } = useNewMessageModel();

  useEffect(() => {
    document.title = `Notifications`;

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

    const Token = cookie.get("Token");

    axios
      .get(`${baseUrl}/api/notifications/getNotificationModal`, {
        headers: {
          Authorization: Token,
        },
      })
      .then((res) => {
        setNotifications(res.data.notifications);
      })
      .catch((err) => {
        console.log(err);
      });

    //turn of unread notifications
    axios.post(
      `${baseUrl}/api/notifications/offunreadNotifications`,
      {},
      {
        headers: {
          Authorization: Token,
        },
      }
    );

    return () => {
      socket.off("newMessageReceived");
    };
  }, []);

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
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            width: "85%",
            mt: 5,
            textAlign: "center",
            p: 5,
            maxHeight: "70vh",
            overflowY: "auto",
            overflowX: "hidden",
            border:"1px solid lightgrey"
          }}
        >
          {/* <Typography
            variant="h5"
            sx={{
              height: "100%",
              width: "100%",
              textAlign: "left",
              display: "flex",
              fontWeight: "500",
              alignItems: "center",
              color: "#1976d2",
              pl: 1,
              // textShadow:"0 0 0.1px black"
            }}
          >
            <NotificationsIcon fontSize="large" />
            Notifications
          </Typography> */}
          {!notifications && <CircularProgress />}
          {notifications && notifications.length===0 && <Typography variant="h5">No Notifications</Typography>}
          {notifications && (
            <List dense={true}>
              {notifications.map((notification , key) => {
                if (notification.type === "newLike") {
                  return <NewLikeNotification key={key} {...notification} />;
                } else if (notification.type === "newComment") {
                  return <NewCommentNotification key={key} {...notification} />;
                } else {
                  return <NewFollowNotification key={key} {...notification} />;
                }
              })}
            </List>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};
export default Notifications;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    return { props: {} };
  }
);
