import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

type SnackbarProps = {
  message: string;
  behaviour: "error" | "warning" | "info" | "success";
  open: boolean | undefined;
  handlerFunction: (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
};

function TransitionUp(props: any) {
  return <Slide {...props} direction="up" />;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// { message, behaviour }: SnackbarProps
const SnackbarComponent = ({
  message,
  behaviour,
  open,
  handlerFunction,
}: SnackbarProps) => {
  return (
    <Snackbar
      autoHideDuration={6000}
      open={open}
      onClose={handlerFunction}
      TransitionComponent={TransitionUp}
    >
      <Alert severity={behaviour} sx={{ width: "120%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default SnackbarComponent;
