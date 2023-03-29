import { useRouter } from "next/router";
import { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../../contexts/SocketContext";
import ReactPlayer from "react-player";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80",
    },
  ],
};

const room = () => {
  const router = useRouter();
  const socket = useSocket().socket.socket;
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);

  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const hostref = useRef<boolean>(false);

  const [showPeer, setShowPeer] = useState<boolean>(true);
  const [mic, setMic] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(true);

  const { roomName } = router.query;

  const handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      socket.emit("iceCandidate", event.candidate, roomName as string);
    }
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    setShowPeer(true);
    if (peerVideoRef.current) peerVideoRef.current.srcObject = event.streams[0];
  };

  const createPeerConnection = (): RTCPeerConnection => {
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.onicecandidate = handleICECandidateEvent;
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  //when the room is created for the first time
  const handleRoomCreated = () => {
    hostref.current = true;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 500, height: 500 },
      })
      .then((stream) => {
        userStreamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
          userVideoRef.current.onloadedmetadata = () => {
            userVideoRef.current?.play();
          };
        }
      })
      .catch((err) => console.log(err));
  };

  //when the room is joined by someone
  const handleRoomJoin = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 500, height: 500 },
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
          userVideoRef.current.onloadedmetadata = () => {
            userVideoRef.current?.play();
          };
        }
        socket.emit("readyToCommunicate", roomName as string);
      })
      .catch((err) => {
        /* handle the error */
        console.log("error", err);
      });
  };

  const initialCall = () => {
    if (hostref.current) {
      rtcConnectionRef.current = createPeerConnection();

      if (userStreamRef.current) {
        rtcConnectionRef.current.addTrack(
          userStreamRef.current.getTracks()[0],
          userStreamRef.current
        );
        rtcConnectionRef.current.addTrack(
          userStreamRef.current.getTracks()[1],
          userStreamRef.current
        );
      }

      rtcConnectionRef.current
        .createOffer()
        .then((offer) => {
          rtcConnectionRef.current?.setLocalDescription(offer);
          socket.emit("offer", offer, roomName as string);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
    //only joined will run this code
    if (!hostref.current) {
      rtcConnectionRef.current = createPeerConnection();
      if (userStreamRef.current) {
        rtcConnectionRef.current.addTrack(
          userStreamRef.current.getTracks()[0],
          userStreamRef.current
        );
        rtcConnectionRef.current.addTrack(
          userStreamRef.current.getTracks()[1],
          userStreamRef.current
        );
      }

      rtcConnectionRef.current.setRemoteDescription(offer);

      rtcConnectionRef.current
        .createAnswer()
        .then((offer) => {
          rtcConnectionRef.current?.setLocalDescription(offer);
          socket.emit("answer", offer, roomName as string);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //stores the answer received after sending offer
  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    rtcConnectionRef.current
      ?.setRemoteDescription(answer)
      .catch((err) => console.log(err));
  };

  const handlerNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current
      ?.addIceCandidate(candidate)
      .catch((err) => console.log(err));
  };

  const onPeerLeave = () => {
    //this user is now the host
    hostref.current = true;
    setShowPeer(false);
    if (peerVideoRef.current && peerVideoRef.current.srcObject) {
      (peerVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
  };

  const leaveRoom = () => {
    socket.emit("leave", roomName as string);
    if (userVideoRef.current && userVideoRef.current.srcObject) {
      (userVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (userVideoRef.current && userVideoRef.current.srcObject) {
      (userVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
    router.push("/");
  };

  useEffect(() => {
    if (!roomName) return;
    socket.emit("joinRoom", roomName as string);

    socket.on("roomCreated", handleRoomCreated);

    socket.on("roomJoined", handleRoomJoin);

    socket.on("readyToCommunicate", initialCall);

    socket.on("leave", onPeerLeave);

    socket.on("roomFull", () => {
      router.push("/videoCall");
    });

    socket.on("offer", handleReceivedOffer);
    socket.on("answer", handleAnswer);

    socket.on("iceCandidate", handlerNewIceCandidateMsg);
  }, [roomName]);

  const toggleMediaStream = (type: string, state: boolean) => {
    userStreamRef.current?.getTracks().forEach((track) => {
      if (track.kind == type) {
        track.enabled = !state;
      }
    });
  };

  const toggleMic = () => {
    setMic((prev) => !prev);
    toggleMediaStream("audio", mic);
  };

  const toggleVideo = () => {
    setVideo((prev) => !prev);
    toggleMediaStream("video", video);
  };

  return (
    <div>
      <video autoPlay ref={userVideoRef} />
      <video
        autoPlay
        style={{ display: showPeer ? "inline-block" : "none" }}
        ref={peerVideoRef}
      />
      <button onClick={toggleMic}>{mic ? "Mic on" : "Mic Off"}</button>
      <button onClick={toggleVideo}>{video ? "Video on" : "Video off"}</button>
      <button onClick={leaveRoom}>Leave room</button>
    </div>
  );
};
export default room;
