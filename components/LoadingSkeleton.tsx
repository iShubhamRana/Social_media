import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";

function Media() {
  return (
    <Card
      sx={{ width: "100% ", ml: "auto", mr: "auto", mt: 5, height: "40rem" }}
    >
      <CardHeader
        sx={{ height: "10%" }}
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={50}
            height={50}
          />
        }
        title={
          <Skeleton
            animation="wave"
            height={"20%"}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />

      <Skeleton sx={{ height: "90%" }} animation="wave" variant="rectangular" />
    </Card>
  );
}

export default function Facebook() {
  return (
    <div style={{width:"85%"}}>
      <Media />
    </div>
  );
}
