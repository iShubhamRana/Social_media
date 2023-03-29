import React, { useState } from "react";
import UnprotectedLayout from "../../components/UnprotectedLayout";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Container } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import KeyIcon from "@mui/icons-material/Key";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";
import SnackbarComponent from "../../components/SnackBar";
import useSnackbar from "../../customhooks/useSnackbar";

import axios from "axios";
import baseUrl from "../../utilsServer/base";

const TokenPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { showSnackbar, message, snackbarTrigger, handleShowSnackbar } =
    useSnackbar();
  const [isFetching, setisFetching] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const router = useRouter();

  const [formState, setFormState] = useState<{
    newPassword: string;
    confirmPassword: string;
  }>({
    newPassword: "",
    confirmPassword: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setisFetching(true);
    axios
      .post(
        `${baseUrl}/api/reset/token`,
        { token: router.query.token, password: formState.newPassword },
        {}
      )
      .then((res) => {
        setisFetching(false);
        snackbarTrigger({
          message: "Password reset successful",
          type: "success",
        });
      })
      .catch((err) => {
        setisFetching(false);
        snackbarTrigger({
          message: "Could not reset password",
          type: "error",
        });
      });
  };
  return (
    <UnprotectedLayout>
      {" "}
      <form onSubmit={handleSubmit}>
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
            width: "80%",
            margin: "auto",
            flexDirection: "column",
            border: "1px solid grey",
            p: 5,
          }}
        >
          <Alert
            severity="info"
            icon={<KeyIcon fontSize="large" />}
            sx={{ width: "95%", ml: 2 }}
          >
            <AlertTitle>Create New Password</AlertTitle>
            Enter new password
          </Alert>{" "}
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
              required
              sx={{ width: "100%" }}
              id="password"
              label="New Password"
              name="newPassword"
              variant="standard"
              type={showPassword ? "text" : "password"}
              onChange={handleFormChange}
              value={formState.newPassword}
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
              required
              sx={{ width: "100%" }}
              id="password"
              label="Confirm Password"
              name="confirmPassword"
              variant="standard"
              type={showPassword ? "text" : "password"}
              onChange={handleFormChange}
              value={formState.confirmPassword}
            />
          </Box>
          <Button
            variant="contained"
            sx={{ mt: 5, alignSelf: "start", ml: 5 }}
            type="submit"
            disabled={formState.confirmPassword !== formState.newPassword}
          >
            Update password
          </Button>
        </Container>
      </form>
    </UnprotectedLayout>
  );
};
export default TokenPage;
