import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useRouter } from "next/router";

const VideoCall = () => {
  const socket = useSocket().socket.socket;
  const [email, setEmail] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
   
  }, [socket,roomId]);

  const handleRoomJoin = async()=>{
    
  }

  return (
    <div>
      <input
        name="room"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input name="email" onChange={(e) => setRoomId(e.target.value)}></input>
      <button onClick={handleRoomJoin}>Click</button>
    </div>
  );
};

export default VideoCall;
