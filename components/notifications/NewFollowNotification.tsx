import { NotificationElement } from "../../types/FetchedNotificationType";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Router from "next/router";
import calculateTime from "../../utilsServer/calculateTime";


const NewFollowNotification = (notification: NotificationElement) => {
  return (
    <ListItem sx={{ mt: 1 }}>
      <ListItemAvatar style={{ cursor: "pointer" }}>
        <Avatar src={notification.user.profilePicUrl}></Avatar>
      </ListItemAvatar>

      <ListItemText
        style={{ cursor: "pointer", display: "flex", columnGap: "5px" }}
        onClick={() => {
          Router.push(`/${notification.user.username}`);
        }}
        primary={notification.user.username}
        secondary={`started following you..  - ${calculateTime(
          new Date(notification.date)
        )} ago`}
        primaryTypographyProps={{ fontSize: "16px" }}
        secondaryTypographyProps={{ fontSize: "16px" }}
      />
    </ListItem>
  );
};
export default NewFollowNotification;
