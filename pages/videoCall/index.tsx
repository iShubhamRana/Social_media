import { useEffect, useState, useCallback, useRef } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useRouter } from "next/router";

const VideoCall = () => {
  const socket = useSocket().socket.socket;
  const [email, setEmail] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const router = useRouter();

  const handleRoomJoin = async () => {
    router.push("/videoCall/" + room);
  };

  return (
    <div>
      <input
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <input
        name="room"
        value={room}
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />

      <button onClick={handleRoomJoin}>Click</button>
    </div>
  );
};

export default VideoCall;
