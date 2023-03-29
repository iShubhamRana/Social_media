import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/Nprogress.css";
import { useEffect } from "react";
import routeProtection from "../utilsServer/routeProtection";
import { protectedRoute } from "../utilsServer/routeProtection";
import Router, { useRouter } from "next/router";
import { createTheme, createMuiTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import SocketContextProvider from "../contexts/SocketContext";

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto"].join(","),
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
      <SocketContextProvider>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </SocketContextProvider>
  );
}
