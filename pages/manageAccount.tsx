import React, { ReactNode, useEffect, useRef } from "react";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
import withAuth from "../utilsServer/withAuth";
import Layout from "../components/Layout";
import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../socket/socketEvents";
import useNewMessageModel from "../customhooks/useNewMessage";
import baseUrl from "../utilsServer/base";

type NotificationProps = ProtectedRouteProps;

const ManageAccount = (props: NotificationProps) => {
  const socket = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const {
    showNewMessageModel,
    newMessageContent,
    setShowNewMessageModel,
    setNewMessageContent,
  } = useNewMessageModel();

  useEffect(() => {
    document.title = `Manage account`;

    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId: props.user?._id as string });
      socket.current.on("newMessageReceived", (data) => {
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
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("newMessageReceived");
      }
    };
  }, []);
  return (
    <Layout {...props}>
      <h1>Manage Accounts Page</h1>
    </Layout>
  );
};
export default ManageAccount;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    return { props: {} };
  }
);
