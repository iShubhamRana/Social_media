import chatMessagecss from "./chatMessage.module.css";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

type ChatMessageProps = {
  text: string;
  date: Date;
  profilePic: string;
  wasSent: boolean;
  messageId: string;
  handleMessageDelete?: (messageId: string) => void;  //is option for reusability
};

const Css = {
  towardsLeft: {
    textAlign: "left",
  },
  towardsRight: {
    textAlign: "right",
  },
};
const ChatMessage = (props: ChatMessageProps) => {
  const [showTime, setShowTime] = useState<string>("");
  const [showPopper, setShowPopper] = useState<boolean>(false);

  useEffect(() => {
    let currTime = "";
    const date = new Date(props.date);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours > 12) {
      currTime = hours - 12 + ":" + minutes + "pm";
    } else {
      currTime = hours + ":" + minutes + "am";
    }
    setShowTime(currTime);
  }, []);

  return (
    <>
      <div
        className={
          props.wasSent
            ? chatMessagecss.sentMessage
            : chatMessagecss.receivedMessage
        }
      >
        <p
          onClick={() => {
            setShowPopper((prev) => !prev);
          }}
          className={
            props.wasSent
              ? chatMessagecss.sentText
              : chatMessagecss.receivedText
          }
        >
          {props.text}
          <br></br>
          <span className={chatMessagecss.dateBox}>{showTime}</span>
        </p>
        <IconButton style={{ display: showPopper ? "block" : "none" }}>
          <DeleteIcon
            onClick={() => {
              if (props.handleMessageDelete) {
                props.handleMessageDelete(props.messageId);
              }
            }}
          />
        </IconButton>
      </div>
    </>
  );
};
export default ChatMessage;
