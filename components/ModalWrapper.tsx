import React from "react";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";

type ModalWrapperProps = {
  children: React.ReactNode;
  setVisibility: React.Dispatch<boolean>;
};

const ModalWrapper = (props: ModalWrapperProps) => {
  return ReactDOM.createPortal(
    <>
      <Box
        component="div"
        sx={{
          width: "100%",
          height: "100%",
          zIndex: "100",
          position: "fixed",
          background: "rgba(0,0,0,0.7)",
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          props.setVisibility(false);
        }}
      ></Box>{" "}
      {props.children}
    </>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default ModalWrapper;
