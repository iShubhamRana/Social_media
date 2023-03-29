import ChatInfoType from "../../types/ChatInfoType";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import calculateTime from "../../utilsServer/calculateTime";
import Badge from "@mui/material/Badge";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ListItemButton from "@mui/material/ListItemButton";
import { useRouter } from "next/router";

type ChatInfoProps = {
  chat: ChatInfoType;
  index: number;
  isOnline: boolean;
};

const ChatInfoDisplayer = (props: ChatInfoProps) => {
  const router = useRouter();
  const trimmedLastMessage = props.chat.lastMessage.substr(0, 20);

  // useEffect(()=>[])

  return (
    <ListItemButton
      sx={{ p: 0 }}
      onClick={() => {
        router.push(`/messages/?message=${props.chat.chatWith_id}`, undefined, {
          shallow: true,
        });
      }}
    >
      <Card
        sx={{
          width: "100%",
          textAlign: "left",
          borderRadius: "none",

        }}
      >
        <CardHeader
          sx={{ p: 1.5 }}
          avatar={
            <Badge
              color="success"
              variant="dot"
              invisible={!props.isOnline}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                sx={{ bgcolor: "black" }}
                aria-label="recipe"
                src={props.chat.chatWith_profilePicUrl}
                // onClick={() => {
                //   router.push(`/${props.chat.chatWith_username}`);
                // }}
              ></Avatar>
            </Badge>
          }
          action={
            <IconButton aria-label="settings">
              {props.chat.hasUnreadMessage && (
                <FiberManualRecordIcon fontSize="small" color="primary" />
              )}
            </IconButton>
          }
          title={props.chat.chatWith_username}
          subheader={
            trimmedLastMessage +
            " . " +
            calculateTime(new Date(props.chat.date))
          }
        />
      </Card>
    </ListItemButton>
  );
};
export default ChatInfoDisplayer;
