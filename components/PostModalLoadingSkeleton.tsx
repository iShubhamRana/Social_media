import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";

import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";

const PostModal = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
      // id="parent"
      component="div"
    >
      <Card
        sx={{
          width: "60%",
          ml: "auto",
          mr: "auto",
          height: "100%",
          boxShadow: "0px 0px 2px black",
        }}
        style={{ fontSize: "20px" }}
      >
        {" "}
        <CardHeader
          sx={{ height: "3rem" }}
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Skeleton
              animation="wave"
              height={"20%"}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          }
        />
        <Skeleton
          sx={{ height: "500px" }}
          animation="wave"
          variant="rectangular"
        />
      </Card>
      <div
        style={{
          width: "40%",
          boxShadow: "0px 0px 2px black",
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    </Box>
  );
};
export default PostModal;
