import React, {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

type PeerContextType = {
  peer: RTCPeerConnection | null;
  createOffer: () => Promise<RTCSessionDescriptionInit | null>;
  createAnswer: (
    offer: RTCSessionDescriptionInit
  ) => Promise<RTCSessionDescriptionInit | null>;
  setRemoteAnswer: (answer: RTCSessionDescriptionInit) => void;
  sendStream: (stream: MediaStream) => void;
  remoteStream: MediaStream | null;
};
const PeerContext = React.createContext<PeerContextType>({
  peer: null,
  createOffer: async () => {
    return null;
  },
  createAnswer: async (offer: RTCSessionDescriptionInit) => {
    return null;
  },
  setRemoteAnswer: async (answer: RTCSessionDescriptionInit) => {},
  sendStream: (stream: MediaStream) => {},
  remoteStream: null,
});

type PeerProviderProps = {
  children: ReactNode;
};

export const usePeer = () => {
  return React.useContext(PeerContext);
};

const PeerProvider = (props: PeerProviderProps) => {
  //get its information from turn servers
  //   const [peer,setPeer] = useState
  const peer = useRef<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  useEffect(()=>{
    alert('parent rendered')
  })
  useEffect(() => {
    // setPeer(new RTCPe erConnection(servers));
    peer.current = new RTCPeerConnection();
  }, []);

  const createOffer = useCallback(async () => {
    if (!peer.current) return null;
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);
    console.log(offer);
    return offer;
  }, [peer]);

  const createAnswer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      if (!peer.current) return null;
      await peer.current.setRemoteDescription(offer);
      const answer = await peer.current.createAnswer(offer);
      await peer.current.setLocalDescription(answer);
      return answer;
    },
    [peer]
  );

  const setRemoteAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      if (!peer.current) return;
      await peer.current.setRemoteDescription(answer);
      return;
    },
    [peer]
  );

  const sendStream = useCallback(
    async (stream: MediaStream) => {
      if (!peer.current) return;
      stream.getTracks().forEach((track) => {
        peer.current?.addTrack(track, stream);
      });
    },
    [peer]
  );

  const handleTrackEvent = useCallback((ev: RTCTrackEvent) => {
    if (!remoteStream) return;
    ev.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });

    // setRemoteStream(streams[0]);
    // alert("stream updated");
  }, []);

  const handleNegotiation = useCallback(async (ev: Event) => {
    // alert('oops negotiation needed')
  }, []);

  // const handleNegotiation = useCallback()

  const handleIceCandidate = useCallback(
    async (ev: RTCPeerConnectionIceEvent) => {
      alert("hi");
      if (ev.candidate) {
        console.log(ev.candidate);
      }
    },
    []
  );

  useEffect(() => {
    if (!peer.current) return;
    // setRemoteStream(new MediaStream());
    peer.current.addEventListener("track", handleTrackEvent);
    peer.current.addEventListener("icecandidate", handleIceCandidate);

    return () => {
      if (peer.current) {
        peer.current.removeEventListener("track", handleTrackEvent);
        peer.current.removeEventListener("icecandidate", handleIceCandidate);
      }
    };
  }, [peer, setRemoteStream]);

  return (
    <PeerContext.Provider
      value={{
        peer:peer.current,
        createOffer,
        createAnswer,
        setRemoteAnswer,
        sendStream,
        remoteStream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;
