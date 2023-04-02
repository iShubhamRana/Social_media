import { io, Socket } from "socket.io-client";
import baseUrl from "../utilsServer/base";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../socket/socketEvents";
import { v4 as uuidv4 } from "uuid";
import router, { useRouter } from "next/router";

import React, { useMemo, ReactNode, useContext, useEffect } from "react";

type SocketContextObj = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};
const SocketContext = React.createContext<SocketContextObj>({
  socket: io(baseUrl),
});

type SocketContextProviderProp = {
  children: ReactNode;
};
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return { socket };
};

const SocketContextProvider = (props: SocketContextProviderProp) => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(
    () => io(baseUrl),
    []
  );
  const router = useRouter();

  useEffect(() => {
    socket.on("callReject", (reason) => {
      alert(reason);
      socket.emit("leave", router.query.roomName as string);
      router.push("/");
    });
    socket.on("incomingVideoCall", (roomName, caller, callerId) => {
      if (
        window.confirm(
          `${caller} is inviting you for a videocall. Would you like to Join?`
        )
      ) {
        router.push("/videoCall/" + roomName);
      } else {
        socket.emit("callReject", callerId);
      }
    });

    return () => {
      socket.off("incomingVideoCall");
      socket.off("callReject");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
