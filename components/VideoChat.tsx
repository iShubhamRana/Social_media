import Box from "@mui/material/Box";
import { useState, useRef } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import TelegramIcon from "@mui/icons-material/Telegram";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import messageCSS from "../components/chats/chatMessage.module.css";

const Message = ({
  msg,
}: {
  msg: { msg: string; type: "sent" | "received" };
}) => {
  const [showTime, setShowTime] = useState<string>("");

  return (
    <div
      className={
        msg.type == "sent" ? messageCSS.sentMessage : messageCSS.receivedMessage
      }
    >
      <p
        className={
          msg.type == "sent" ? messageCSS.sentText : messageCSS.receivedText
        }
      >
        {msg.msg}
      </p>
    </div>
  );
};

const Chat = () => {
  const socket = useSocket().socket.socket;
  const router = useRouter();
  const { roomName } = router.query;

  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<
    {
      msg: string;
      type: "sent" | "received";
    }[]
  >([]);

  const divRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (divref: React.RefObject<HTMLDivElement | null>) => {
    if (divref.current) {
      divref.current.scrollIntoView({ behavior: "smooth" });
      divref.current.scrollTop = divref.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!roomName) return;
    socket.on("newVideoMessage", (msg) => {
      setChatMessages((prev) => [...prev, { msg, type: "received" }]);
      scrollToBottom(divRef);
    });
    socket.on("videoMessageSucessfullySent", (msg) => {
      setChatMessages((prev) => [...prev, { msg, type: "sent" }]);
      scrollToBottom(divRef);
    });

    return () => {
      socket.off("newVideoMessage");
      socket.off("videoMessageSucessfullySent");
    };
  }, [router]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("sendVideoMessage", message, roomName as string);
    setMessage("");
  };

  return (
    <Box
      sx={{
        width: "95%",
        height: "100%",
        background: "white ",
        borderRadius: "10px",
        border: "1px solid lightgrey",
      }}
    >
      <Box
        id="chat-displayer"
        sx={{ height: "90%", overflow: "auto" }}
        ref={divRef}
      >
        {chatMessages.map((msg , key) => {
          return <Message msg={msg} key={key} />;
        })}
      </Box>
      <Box
        id="messageinput"
        sx={{
          height: "10%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        component="form"
        onSubmit={handleSendMessage}
      >
        {" "}
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
      </Box>
    </Box>
  );
};
export default Chat;
