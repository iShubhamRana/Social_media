import { Container, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useState } from "react";
import Link from "next/link";
import SnackbarComponent from "../components/SnackBar";
import SimpleBackdrop from "../components/BackDrop";
import { loginUser, setToken } from "../utilsServer/authUser";
import UnprotectedLayout from "../components/UnprotectedLayout";
import useSnackbar from "../customhooks/useSnackbar";
import { useCallback } from "react";

const Login = () => {
  /************************************************************************************************************************************* */

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true);
  const [isFetching, setisFetching] = useState<boolean>(false);
  const { showSnackbar, message, snackbarTrigger, handleShowSnackbar } =
    useSnackbar();
  /***************************************************************************************************************************************/

  const handleClickShowPassword = useCallback(() => {
    setShowPassword((show) => !show);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name,
        value = e.target.value;
      if (name === "email") setEmail(value);
      else setPassword(value);

      if (Boolean(email) && Boolean(password)) {
        setSubmitDisabled(false);
      } else {
        setSubmitDisabled(true);
      }
    },
    [email, password]
  );

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setisFetching(true);
      loginUser(email, password)
        .then((token) => {
          setisFetching(false);
          snackbarTrigger({
            message: "Successfully Loggedin",
            type: "success",
          });
          setToken(token);
          setEmail("");
          setPassword("");
        })
        .catch((err) => {
          setisFetching(false);
          snackbarTrigger({ message: "Invalid credentials", type: "error" });
        });
    },
    [email, password]
  );

  return (
    <UnprotectedLayout>
      {isFetching && <SimpleBackdrop open={isFetching} />}
      <form onSubmit={handleLogin}>
        <SnackbarComponent
          open={showSnackbar}
          handlerFunction={handleShowSnackbar}
          message={message.message}
          behaviour={message.type}
        />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              width: "80%",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              pt: 5,
              pl: 2,
              pr: 2,
              pb: 5,
              borderRadius: 5,
              rowGap: "15px",
            }}
            elevation={3}
          >
            <Alert
              severity="info"
              icon={<TagFacesIcon fontSize="large" />}
              sx={{ width: "95%", ml: 2 }}
            >
              <AlertTitle>Welcome Back !!</AlertTitle>
              Login with — <strong>username</strong> and{" "}
              <strong>password</strong>
            </Alert>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                width: "90%",
              }}
            >
              <AccountCircle sx={{ color: "action.active", mr: 1 }} />
              <TextField
                sx={{ width: "100%" }}
                id="email-id"
                label="Email id"
                variant="standard"
                value={email}
                type="email"
                name="email"
                onChange={handleInputChange}
                required
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                width: "90%",
              }}
            >
              {showPassword ? (
                <VisibilityOffIcon
                  sx={{ color: "action.active", mr: 1 }}
                  onClick={handleClickShowPassword}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <VisibilityIcon
                  sx={{ color: "action.active", mr: 1 }}
                  onClick={handleClickShowPassword}
                  style={{ cursor: "pointer" }}
                />
              )}
              <TextField
                sx={{ width: "100%" }}
                id="password"
                label="Password"
                variant="standard"
                value={password}
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleInputChange}
                required
              />
            </Box>
            <Button
              variant="contained"
              color="info"
              sx={{ width: "90%", p: 1, mt: 3 }}
              type="submit"
              disabled={submitDisabled}
            >
              Login
            </Button>
            <Alert severity="info" sx={{ width: "90%", ml: 2 }}>
              <AlertTitle>
                Forgot Password ? <Link href="/reset">Click here</Link>
              </AlertTitle>
            </Alert>
            <Alert severity="warning" sx={{ width: "90%", ml: 2 }}>
              <AlertTitle>
                New User? <Link href="/signup">Signup Here</Link>{" "}
              </AlertTitle>
            </Alert>
          </Paper>
        </Container>
      </form>
    </UnprotectedLayout>
  );
};

export default Login;
