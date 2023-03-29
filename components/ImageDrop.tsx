import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";

type ImageDropProps = {
  highlighted: boolean;
  setHighlighted: React.Dispatch<boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mediaPreview: null | string;
  setMediaPreview: React.Dispatch<string>;
  setMedia: React.Dispatch<File>;
  inputRef: React.RefObject<HTMLInputElement>;
  sx: {};
  children: React.ReactNode;
};

const ImageDrop = ({
  highlighted,
  setHighlighted,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia,
  inputRef,
  sx,
  children,
}: ImageDropProps) => {
  return (
    <Box
      component="div"
      // sx={{ p: 2, border: "1px dashed grey" , width:"50%" , }}
      sx={{
        ...sx,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        
        position:"relative"
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setHighlighted(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setHighlighted(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setHighlighted(true);
        setMedia(e.dataTransfer.files[0]);
        setMediaPreview(URL.createObjectURL(e.dataTransfer.files[0]));
      }}
    >
      <input
        style={{ display: "none" }}
        type="file"
        accept="image/gif, image/jpeg, image/png"
        onChange={handleChange}
        name="media"
        ref={inputRef}
      ></input>

      {!mediaPreview ? (
        <Box
          component="div"
          style={{
            cursor: "pointer",
            color: highlighted ? "green" : "black",
          }}
          sx={{ p: 2 }}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
        >
          {children}
        </Box>
      ) : (
        <Image
          src={mediaPreview}
          alt="Your DP"
          // width={500}
          // height={500}
          layout={"fill"}
          objectFit="cover"
          objectPosition="center"
          // objectPosition: "center";
        />
      )}
    </Box>
  );
};

export default ImageDrop;
