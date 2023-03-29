import { ReactNode} from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Search from "./Search";
import SideMenu from "./SideMenu";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
import Grid from "@mui/material/Grid";

type LayoutProps = {
  children: ReactNode;
} & ProtectedRouteProps;

const Layout = (props: LayoutProps) => {
  return (
    <>
      <Head>
        <title>GenZee</title>
        <meta name="Welcome" content="Welcome Page for Genzee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type="text/css" href="/nprogress.css"></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Navbar {...props} />

      <Grid container spacing={2} sx={{ mt: 10  }} >
        <Grid item xl={2} lg={2} md={2} sm={2}>
          {props.user && <SideMenu user={props.user} />}
        </Grid>
        <Grid item xl={7} lg={7} md={7} sm={7} sx={{}}>
          {props?.children}
        </Grid>
        <Grid item xl={3} lg={3} md={3} sm={3}>
          {props.user && <Search {...props} />}
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
