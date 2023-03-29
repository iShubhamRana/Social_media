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

}

export interface InterServerEvents {
  ping: () => void;
}
