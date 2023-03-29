import { useState } from "react";
import Message from "../types/MessageType";

const useSnackbar = () => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({
    message: "",
    type: "success",
  });

  const handleShowSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  const snackbarTrigger = (message: Message): void => {
    setShowSnackbar(true);
    setMessage(message);
  };

  return { showSnackbar, message, snackbarTrigger, handleShowSnackbar };
};

export default useSnackbar;
