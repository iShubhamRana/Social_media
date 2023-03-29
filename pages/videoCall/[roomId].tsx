import { useRouter } from "next/router";
import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { usePeer } from "../../contexts/webRTC";
import ReactPlayer from "react-player";


const room = () => {
  const socket = useSocket().socket.socket;
  const peerContext = usePeer();

  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteEmailId, setRemoteEmailId] = useState<string>("");
  // const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const router = useRouter();
  const roomId = router.query.roomId;

  const getUserMedia = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
    peerContext.sendStream(stream);
  }, [setMyStream, peerContext.peer]);

  useEffect(() => {
    alert('child')
    console.log(peerContext.peer)
    // if (peerContext.peer) {
    //   getUserMedia();
    //   peerContext.createOffer();
    // }
  }, [peerContext.peer]);

  return (
    <div>
      You are connected to {remoteEmailId}
      {myStream && <ReactPlayer url={myStream} playing muted />}
      {peerContext.remoteStream && (
        <ReactPlayer url={peerContext.remoteStream} playing muted />
      )}
    </div>
  );
};
export default room;
