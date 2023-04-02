import { FormControl } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailIcon from "@mui/icons-material/Email";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Container, Paper } from "@mui/material";
import { useRouter } from "next/router";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import baseUrl from "../utilsServer/base";
import ImageDrop from "../components/ImageDrop";
import SnackbarComponent from "../components/SnackBar";
import SimpleBackdrop from "../components/BackDrop";
import uploadPic from "../utilsServer/cloudinaryUpload";
import { setToken } from "../utilsServer/authUser";
import UserObj from "../types/UserType";
import UnprotectedLayout from "../components/UnprotectedLayout";

import useSnackbar from "../customhooks/useSnackbar";

const Signup = () => {
  /*States***************************************************************************************************/

  const [User, SetUser] = React.useState<UserObj>({
    name: "",
    email: "",
    password: "",
    username: "",
    profilePicUrl: "*", // to denote absence
  });

  const [usernameState, setUsernameState] = useState<
    "ABSENT" | "FETCHING" | "VALID" | "INVALID"
  >("ABSENT");

  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [media, setMedia] = useState<null | File>(null);
  const [mediaPreview, setMediaPreview] = useState<null | string>(null);
  const [highlighted, setHighlighted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showSnackbar, message, snackbarTrigger, handleShowSnackbar } =
    useSnackbar();
  const [isFetching, setisFetching] = useState<boolean>(false);

  /**********************************************************************************************************/
  useEffect(() => {
    const validUser = Object.values(User).every((item) => Boolean(item));
    setSubmitDisabled(!validUser);
  }, [User]);

  const handleClickShowPassword = useCallback(
    () => setShowPassword((show) => !show),
    []
  );

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      SetUser((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    },
    []
  );

  useEffect(() => {
    if (User.username) {
      setUsernameState("FETCHING");

      const check = setTimeout(() => {
        axios
          .get(`${baseUrl}/api/signup/${User.username}`)
          .then((res) => {
            setUsernameState("VALID");
            snackbarTrigger({ message: "Username Available", type: "success" });
          })
          .catch((err) => {
            console.log(err);
            setUsernameState("INVALID");
            snackbarTrigger({ message: err.response.data, type: "error" });
          });
      }, 1000);

      return () => {
        clearTimeout(check);
        setUsernameState("ABSENT");
      };
    }
  }, [User.username]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(e.target.files[0]);
      setMediaPreview(URL.createObjectURL(e.target.files[0]));
    }
  }, []);

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setisFetching(true);

      let profilePicUrl: string | null = "*";

      if (media !== null) {
        profilePicUrl = await uploadPic(media);
      }

      if (media && !profilePicUrl) return;

      //api call

      axios
        .post(`${baseUrl}/api/signup`, {
          user: { ...User, profilePicUrl },
        })
        .then((res) => {
          setisFetching(false);
          snackbarTrigger({
            message: "Successfully Signedup",
            type: "success",
          });
          SetUser({
            name: "",
            email: "",
            username: "",
            password: "",
            profilePicUrl: "*",
          });
          setMedia(null);
          setToken(res.data);
          router.push("/home");
        })
        .catch((err) => {
          setisFetching(false);
          snackbarTrigger({ message: err.response.data, type: "error" });
        });
    },

    [media, User]
  );

  return (
    <UnprotectedLayout>
      {isFetching && <SimpleBackdrop open={isFetching} />}
      <form onSubmit={handleRegister}>
        <SnackbarComponent
          open={showSnackbar}
          handlerFunction={handleShowSnackbar}
          message={message.message}
          behaviour={message.type}
        />
        <FormControl
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
              borderRadius: "10px",
              border: "1px solid lightgrey",
            }}
          >
            <Alert
              severity="info"
              icon={<SettingsIcon fontSize="large" />}
              sx={{ width: "95%", ml: 2, mb: 2 }}
            >
              <AlertTitle>Get Started !!</AlertTitle>
              <strong>Create an Account</strong>
            </Alert>
            <ImageDrop
              mediaPreview={mediaPreview}
              setMediaPreview={setMediaPreview}
              setMedia={setMedia}
              handleChange={handleChange}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
              inputRef={inputRef}
              sx={{
                p: 2,
                border: "1px dashed grey",
                width: "50%",
                height: "300px",
              }}
            >
              <UploadFileIcon fontSize="large" />
              Drag and Drop or Click To Upload Avatar
            </ImageDrop>
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
                required
                id="name"
                label="Name"
                variant="standard"
                type="text"
                name="name"
                value={User.name}
                onChange={handleFormChange}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                width: "90%",
                m: 1,
              }}
            >
              <EmailIcon sx={{ color: "action.active", mr: 1 }} />
              <TextField
                required
                sx={{ width: "100%" }}
                id="email-id"
                label="Email id"
                variant="standard"
                name="email"
                type="email"
                value={User.email}
                onChange={handleFormChange}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                width: "90%",
                m: 1,
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
                label="Password"
                name="password"
                variant="standard"
                type={showPassword ? "text" : "password"}
                onChange={handleFormChange}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                width: "90%",
                m: 1,
              }}
            >
              <AlternateEmailIcon sx={{ color: "action.active", mr: 1 }} />
              <TextField
                required
                sx={{ width: "90%", mr: 2 }}
                id="username"
                label="username"
                variant="standard"
                name="username"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange(e);
                }}
                type="text"
              />
              {usernameState === "ABSENT" && <p></p>}
              {usernameState === "FETCHING" && <CircularProgress />}
              {usernameState === "VALID" && (
                <CheckIcon color="success" fontSize="large" />
              )}
              {usernameState === "INVALID" && (
                <ClearIcon color="error" fontSize="large" />
              )}
            </Box>

            <Button
              variant="contained"
              color="info"
              sx={{ width: "90%", p: 1, mt: 5, m: 2 }}
              disabled={submitDisabled || usernameState !== "VALID"}
              type="submit"
            >
              Signup
            </Button>

            <Alert severity="warning" sx={{ width: "90%", ml: 2 }}>
              <AlertTitle>
                Already have an account? <Link href="/login">Login here</Link>{" "}
              </AlertTitle>
            </Alert>
          </Paper>
        </FormControl>
      </form>
    </UnprotectedLayout>
  );
};
export default Signup;
