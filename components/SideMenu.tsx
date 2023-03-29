import React, { SyntheticEvent, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import Router, { useRouter } from "next/router";
import Badge from "@mui/material/Badge";
import { blueGrey } from "@mui/material/colors";
import FetchedUserObj from "../types/FetchedUserTypes";

type SidemenuProps = {
  user: FetchedUserObj;
};

const SideMenu = (props: SidemenuProps) => {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Stack
      spacing={2}
      direction="column"
      sx={{
        left: "0px",
        width: "10%",
        top: "0px",
        height: "100vh",
        pt: "100px",
        background: "#fff",
        boxShadow:
          "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
      }}
      position="fixed"
    >
      <Tabs
        value={router.pathname}
        onChange={handleChange}
        sx={{ p: 0 }}
        orientation="vertical"
        // variant="scrollable"
        scrollButtons={false}
        aria-label="scrollable prevent tabs example"
        centered
      >
        <Tab
          icon={<HomeIcon fontSize="large" sx={{ color: blueGrey[800] }} />}
          iconPosition="start"
          label="Home"
          value="/"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            background: router.pathname == "/" ? "#eaf1fb" : "#fff",
          }}
          onClick={() => {
            Router.push("/");
          }}
        ></Tab>
        <Tab
          value="/messages"
          icon={
            <Badge
              variant="dot"
              color="primary"
              invisible={
                !props.user.newMessagePopup || !props.user.unreadMessage
              }
            >
              <MessageIcon
                fontSize="large"
                sx={{
                  color: blueGrey[800],
                }}
              ></MessageIcon>
            </Badge>
          }
          iconPosition="start"
          label="Messages"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            background: router.pathname == "/messages" ? "#eaf1fb" : "#fff",
          }}
          onClick={() => {
            Router.push("/messages");
          }}
        />
        <Tab
          value="/notifications"
          icon={
            <Badge
              variant="dot"
              color="primary"
              invisible={
                !props.user.newMessagePopup || !props.user.unreadNotification
              }
            >
              <NotificationsActiveIcon
                fontSize="large"
                sx={{
                  color: blueGrey[800],
                }}
              ></NotificationsActiveIcon>
            </Badge>
          }
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            background:
              router.pathname == "/notifications" ? "#eaf1fb" : "#fff",
          }}
          iconPosition="start"
          label="Notifications"
          onClick={() => {
            Router.push("/notifications");
          }}
        />

        <Tab
          value={`/${props.user.username}`}
          icon={
            <ManageAccountsIcon
              fontSize="large"
              sx={{ color: blueGrey[800] }}
            />
          }
          iconPosition="start"
          label="Account"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            background:
              router.pathname == `/${props.user.username}` ? "#eaf1fb" : "#fff",
          }}
          onClick={() => {
            Router.push(`/${props.user.username}`);
          }}
        />
        <Tab
          value="/logout"
          icon={<LogoutIcon fontSize="large" />}
          iconPosition="start"
          label="Logout"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            background:
              router.pathname == `/logout` ? "#eaf1fb" : "#fff",
          }}
          onClick={() => {
            Router.push("/logout");
          }}
        />
      </Tabs>
    </Stack>
  );
};
export default SideMenu;
