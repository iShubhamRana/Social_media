import FetchedUserObj from "./FetchedUserTypes";
type ChatInfoType = {
  chat_id: string;
  chatWith_id: string;
  chatWith_username: string;
  chatWith_profilePicUrl: string;
  lastMessage: string;
  hasUnreadMessage: boolean;
  date: Date;
};

export default ChatInfoType;
