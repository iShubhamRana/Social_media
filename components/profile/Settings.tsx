import React, { useState, useEffect, useCallback } from "react";
import FetchedUserObj from "../../types/FetchedUserTypes";
import FetchedProfile from "../../types/FetchedProfile";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import KeyIcon from "@mui/icons-material/Key";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import TelegramIcon from "@mui/icons-material/Telegram";
import Collapse from "@mui/material/Collapse";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import cookie from "js-cookie";
import axios from "axios";
import baseUrl from "../../utilsServer/base";
import useSnackbar from "../../customhooks/useSnackbar";
import SnackbarComponent from "../SnackBar";
import Backdrop from "../BackDrop";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";

type ProfileProps = {
  viewingUser: FetchedUserObj | null;
  profileObj: FetchedProfile;
  fetchProfile: () => void;
};

const Settings = (props: ProfileProps) => {
  const [open1, setopen1] = useState<boolean>(false);

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [passwords, setPasswords] = useState<{
    oldPassword: String;
    newPassword: String;
    confirmPassword: String;
  }>({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const [disable, setDisabled] = useState<boolean>(true);

  const { showSnackbar, message, snackbarTrigger, handleShowSnackbar } =
    useSnackbar();
  const [isFetching, setisFetching] = useState<boolean>(false);

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswords((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    },
    []
  );

  useEffect(() => {
    if (
      passwords.oldPassword.trim() === "" ||
      passwords.newPassword.trim() === "" ||
      passwords.confirmPassword.trim() === "" ||
      passwords.confirmPassword !== passwords.newPassword
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [passwords]);

  const handlePasswordSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const Token = cookie.get("Token");

      setisFetching(true);

      axios
        .put(
          `${baseUrl}/api/profile/changePassword`,
          {
            ...passwords,
          },
          {
            headers: {
              Authorization: Token,
            },
          }
        )
        .then((res) => {
          setisFetching(false);
          snackbarTrigger({ message: res.data, type: "success" });
          setPasswords({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        })
        .catch((err) => {
          setisFetching(false);
          snackbarTrigger({ message: err.response.data, type: "error" });
        });
    },
    [passwords]
  );

  const handleMessageToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const allowed = e.target.checked;
      const Token = cookie.get("Token");
      setisFetching(true);
      axios
        .put(
          `${baseUrl}/api/profile/allowPopup`,
          {
            allowed,
          },
          {
            headers: {
              Authorization: Token,
            },
          }
        )
        .then((res) => {
          setisFetching(false);
          snackbarTrigger({ message: res.data, type: "success" });
        })
        .catch((err) => {
          setisFetching(false);
          snackbarTrigger({ message: err.response.data, type: "error" });
        });
    },
    []
  );

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <SnackbarComponent
        open={showSnackbar}
        handlerFunction={handleShowSnackbar}
        message={message.message}
        behaviour={message.type}
      />
      <Backdrop open={isFetching} />
      <Paper sx={{ width: "80%", mt: 5, textAlign: "center" }}>
        <List sx={{ width: "100%" }}>
          <ListItemButton
            onClick={() => {
              setopen1((prev) => !prev);
            }}
          >
            <ListItemIcon>
              <KeyIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Change Password ?" />
            {open1 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <form
              onSubmit={handlePasswordSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginBottom: "2px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  width: "80%",
                  mb: 2,
                  mt: 2,
                }}
              >
                {showOldPassword ? (
                  <VisibilityOffIcon
                    sx={{ color: "action.active", mr: 1 }}
                    onClick={() => {
                      setShowOldPassword((prev) => !prev);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <VisibilityIcon
                    sx={{ color: "action.active", mr: 1 }}
                    onClick={() => {
                      setShowOldPassword((prev) => !prev);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <TextField
                  required
                  sx={{ width: "100%" }}
                  id="password"
                  label=" Old Password"
                  name="oldPassword"
                  variant="standard"
                  type={showOldPassword ? "text" : "password"}
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  width: "80%",
                  mb: 2,
                }}
              >
                {showNewPassword ? (
                  <VisibilityOffIcon
                    sx={{ color: "action.active", mr: 1 }}
                    onClick={() => {
                      setShowNewPassword((prev) => !prev);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <VisibilityIcon
                    sx={{ color: "action.active", mr: 1 }}
                    onClick={() => {
                      setShowNewPassword((prev) => !prev);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <TextField
                  required
                  sx={{ width: "100%" }}
                  id="password"
                  label=" New Password"
                  name="newPassword"
                  variant="standard"
                  type={showNewPassword ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  width: "80%",
                  mb: 2,
                }}
              >
                {showConfirmPassword ? (
                  <VisibilityOffIcon
                    sx={{ color: "action.active", mr: 1 }}
                    onClick={() => {
                      setShowConfirmPassword((prev) => !prev);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <VisibilityIcon
                    sx={{ color: "action.active", mr: 1 }}
                    onClick={() => {
                      setShowConfirmPassword((prev) => !prev);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <TextField
                  required
                  sx={{ width: "100%" }}
                  id="password"
                  label=" Confirm Password"
                  name="confirmPassword"
                  variant="standard"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </Box>
              <Button
                variant="contained"
                type="submit"
                disabled={disable}
                sx={{ mt: 1, mb: 2 }}
              >
                Change Password
              </Button>
            </form>
          </Collapse>
          <ListItem>
            <ListItemIcon>
              <TelegramIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Show New Message Popup ?" />
            <Switch
              defaultChecked={props.viewingUser?.newMessagePopup}
              onChange={handleMessageToggle}
              name="popup"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};
export default Settings;
