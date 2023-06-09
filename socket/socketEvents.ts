import { FetchedMessage } from "../types/MessageModalType";
import { FetchedChat } from "../types/ChatType";
export interface ServerToClientEvents {
  //used for getting active users
  connectedUsers: (e: {
    users: { userId: string; socketId: string }[];
  }) => void;
  //send loaded messages
  messagesLoaded: (e: { chat: FetchedChat }) => void;
  //responds when the new sendMessage is complete
  messageSent: (e: { message: FetchedMessage }) => void;
  //used by messages component, to update last message etc
  newMessageReceived: (e: {
    message: FetchedMessage;
    chatWith: string;
    chatWith_username: string;
    chatWith_profilePic: string;
  }) => void;
  //used by the already openend chatbox to update incoming message
  updateChatBox: (e: { message: FetchedMessage; chatWith: string }) => void;
  //response to deleteMessage by client
  msgDeleteSuccessful: (e: { messageId: string }) => void;
  deleteChatSuccessful: (e: { chatWith: string }) => void;

  //video call
  roomCreated: () => void;
  roomJoined: () => void;
  roomFull: () => void;
  readyToCommunicate: () => void;
  iceCandidate: (candidate: RTCIceCandidate) => void;
  offer: (offer: RTCSessionDescriptionInit) => void;
  answer: (answer: RTCSessionDescriptionInit) => void;
  leave: () => void;

  //for videocall chatbox
  newVideoMessage: (msg: string) => void;
  videoMessageSucessfullySent: (msg: string) => void;
  //present inside socket context
  callReject: (reason: string) => void;
  incomingVideoCall: (
    roomName: string,
    caller: string,
    callerId: string
  ) => void;
}

export interface ClientToServerEvents {
  //when a new user comes online
  join: (e: { userId: string }) => void;
  //when logs off
  disconnectUser: () => void;
  //calls when the chat box is open
  loadMessages: (e: { owner: string; chatWith: string }) => void;
  //used while sending message
  sendMessage: (e: {
    owner: string;
    chatWith: string;
    text: string;
    username: string;
    profilepic: string;
  }) => void;
  //marks all the messages as read , while unmounting the openend chatbox
  markRead: (e: { owner: string; chatWith: string }) => void;
  //turns off the newMessage notification while leaving messages page
  markMessagesRead: (e: { userId: string }) => void;
  //for deleting message
  deleteMessage: (e: {
    owner: string;
    chatWith: string;
    messageId: string;
  }) => void;

  deleteChat: (e: { owner: string; chatWith: string }) => void;

  //for videocall
  joinRoom: (roomName: string) => void;
  iceCandidate: (candidate: RTCIceCandidate, roomName: string) => void;
  readyToCommunicate: (roomName: string) => void;
  offer: (offer: RTCSessionDescriptionInit, roomName: string) => void;
  answer: (offer: RTCSessionDescriptionInit, roomName: string) => void;
  leave: (roomName: string) => void;

  //for videoCall chat box
  sendVideoMessage: (msg: string, roomName: string) => void;
  videoCallUser: (
    userId: string,
    roomName: string,
    caller: string,
    callerId: string
  ) => void;
  callReject: (userId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}
