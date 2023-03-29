import { io, Socket } from "socket.io-client";
import baseUrl from "../utilsServer/base";
import { ServerToClientEvents, ClientToServerEvents } from "../socket/socketEvents";

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
  const socket =  useContext(SocketContext);
  return { socket};
};

const SocketContextProvider = (props: SocketContextProviderProp) => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(
    () => io(baseUrl),
    []
  );

  return (
    <SocketContext.Provider value={{socket}}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
