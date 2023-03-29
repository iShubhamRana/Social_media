import { useState } from "react";
import { FetchedMessage } from "../types/MessageModalType";
const useNewMessageModel = () => {
  const [showNewMessageModel, setShowNewMessageModel] =
    useState<boolean>(false);

  type newMessageContentType = {
    message: FetchedMessage;
    userInfo: {
      id: string;
      username: string;
      profilepic: string;
    };
  };

  const [newMessageContent, setNewMessageContent] =
    useState<newMessageContentType>({
      message: {
        sender: "",
        receiver: "",
        msg: "",
        date: new Date(),
        _id: "",
      },
      userInfo: {
        id: "",
        username: "",
        profilepic: "",
      },
    });


  return { showNewMessageModel , newMessageContent, setShowNewMessageModel , setNewMessageContent };
};

export default useNewMessageModel;
