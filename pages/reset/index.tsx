import React, { useState } from "react";
import UnprotectedLayout from "../../components/UnprotectedLayout";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Container, Paper } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";
import axios from "axios";
import baseUrl from "../../utilsServer/base";
import SnackbarComponent from "../../components/SnackBar";
import useSnackbar from "../../customhooks/useSnackbar";

const TokenPage = () => {
  const [email, setEmail] = useState<string>("");
  const [isFetching, setisFetching] = useState<boolean>(false);
  const { showSnackbar, message, snackbarTrigger, handleShowSnackbar } =
    useSnackbar();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setisFetching(true);
    axios
      .post(`${baseUrl}/api/reset`, { email }, {})
      .then((res) => {
        setisFetching(false);
        snackbarTrigger({
          message: "Email sent successfully",
          type: "success",
        });
        setEmail("");
      })
      .catch((err) => {
        setisFetching(false);
        snackbarTrigger({
          message: "Could not send email",
          type: "error",
        });
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
            margin: "auto",
            flexDirection: "column",
            border: "1px solid lightgrey",
            borderRadius:"10px",
            p: 5,
          }}
        >
          <Alert
            severity="info"
            icon={<SettingsIcon fontSize="large" />}
            sx={{ width: "95%", ml: 2 }}
          >
            <AlertTitle>Reset Password!!</AlertTitle>
            You will receive a change password link to the entered email !
          </Alert>{" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              width: "90%",
              mt: 2,
            }}
          >
            <EmailIcon sx={{ color: "action.active", mr: 1 }} />
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
          <Button
            variant="contained"
            sx={{ mt: 5, alignSelf: "start", ml: 5 }}
            type="submit"
            disabled={isFetching}
          >
            Send email
          </Button>
        </Paper>
      </form>
    </UnprotectedLayout>
  );
};
export default TokenPage;
