import AppBar from "@mui/material/AppBar";
import { Button } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type NavbarProps = ProtectedRouteProps;

const Navbar = (props: NavbarProps) => {
  const router = useRouter();

  return (
    <AppBar position="fixed" sx={{ "& button": { m: 1 } }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          {/* <MenuIcon></MenuIcon> */}
        </IconButton>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          GenZee
        </Typography>
        {!props.user && (
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            onClick={() => {
              router.replace("/login");
            }}
          >
            Login
          </Button>
        )}
        {!props.user && (
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            onClick={() => {
              router.replace("/signup");
            }}
          >
            Signup
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
