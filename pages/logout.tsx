import React, { ReactNode, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
import { useRouter } from "next/router";
import { destroyToken } from "../utilsServer/authUser";
import withAuth from "../utilsServer/withAuth";
import Layout from "../components/Layout";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type LogoutProps = ProtectedRouteProps;

const Logout = (props: LogoutProps) => {
  const router = useRouter();
  useEffect(() => {
    document.title = `Logout`;
    console.log(props);
  }, []);
  const handleLogout = () => {
    try {
      destroyToken();
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Layout {...props}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Paper
          sx={{
            border: "1px solid lightgrey",
            width: "60%",
            height: "fit-content",
            borderRadius: "15px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 5,
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: 5 }}>
            Are you sure you want to logout?
          </Typography>

          <Box
            sx={{
              width: "40%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button variant="outlined" onClick={() => {
              router.push("/")
            }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};
export default Logout;

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    return { props: {} };
  }
);
