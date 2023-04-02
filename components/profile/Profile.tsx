import FetchedUserObj from "../../types/FetchedUserTypes";
import FetchedProfile from "../../types/FetchedProfile";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import ListItemText from "@mui/material/ListItemText";
import { blueGrey, red, pink } from "@mui/material/colors";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ProfilePostDisplayer from "./ProfilePostDisplayer";
import DoneIcon from "@mui/icons-material/Done";
import follow from "../../utils/follow";
import { Types } from "mongoose";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import unfollow from "../../utils/unfollow";
import Backdrop from "../BackDrop";
import baseUrl from "../../utilsServer/base";
import { io, Socket } from "socket.io-client";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { Paper } from "@mui/material";

type ProfileProps = {
  viewingUser: FetchedUserObj | null;
  profileObj: FetchedProfile;
  fetchProfile: () => void;
};

const Profile = (props: ProfileProps) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const router = useRouter();

  const handleFollow = useCallback(() => {
    if (!props.viewingUser) return;
    setFetching(true);

    follow(props.profileObj.profile.user._id)
      .then((res) => {
        props.fetchProfile();
        setFetching(false);
      })
      .catch((err) => {
        console.log(err);
        setFetching(false);
      });
  }, []);

  const handleUnfollow = useCallback(() => {
    if (!props.viewingUser) return;
    setFetching(true);
    unfollow(props.profileObj.profile.user._id)
      .then((res) => {
        props.fetchProfile();
        setFetching(false);
      })
      .catch((err) => {
        props.fetchProfile();
        setFetching(false);
      });
  }, []);

  const handleMessage = useCallback(async () => {
    const Token = cookie.get("Token");
    setFetching(true);
    await axios
      .post(
        `${baseUrl}/api/messages/createChat`,
        {
          chatWith: props.profileObj.profile.user._id,
        },
        {
          headers: {
            Authorization: Token,
          },
        }
      )
      .then(() => {
        setFetching(false);
        router.push(`/messages`);
      })
      .catch((err) => {
        setFetching(false);
        console.log(err);
      });
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Backdrop open={fetching} />

      <Card
        sx={{ display: "flex", width: "100%", height: "fit-content", mt: 5 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "70%" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {props.profileObj.profile.user.name}
              {props.viewingUser &&
                props.profileObj.profile.user._id !== props.viewingUser._id &&
                (props.profileObj.followers.find(
                  (follower) => follower.user === props.viewingUser?._id
                ) ? (
                  <Button
                    sx={{ ml: 2 }}
                    endIcon={<DoneIcon />}
                    variant="outlined"
                    onClick={handleUnfollow}
                    disabled={fetching}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    onClick={handleFollow}
                    disabled={fetching}
                    endIcon={<PersonAddIcon />}
                  >
                    Follow
                  </Button>
                ))}

              {props.viewingUser &&
                props.profileObj.profile.user._id !== props.viewingUser._id && (
                  <Button
                    variant="contained"
                    sx={{ ml: 2 }}
                    disabled={fetching}
                    onClick={handleMessage}
                  >
                    {" "}
                    Message
                  </Button>
                )}
            </Typography>

            {/* <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {props.profileObj.profile.user.username}
          </Typography> */}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {props.profileObj.profile.bio}
            </Typography>
            <List disablePadding={true} sx={{ mt: 2, mb: 3 }}>
              <ListItem disablePadding={true}>
                <ListItemIcon>
                  <EmailIcon fontSize="large" sx={{ color: blueGrey[800] }} />
                </ListItemIcon>
                <ListItemText primary={props.profileObj.profile.user.email} />
              </ListItem>

              <ListItem disablePadding={true} sx={{ mt: 1 }}>
                <ListItemIcon>
                  <InstagramIcon fontSize="large" sx={{ color: pink[600] }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    props.profileObj.profile.social &&
                    props.profileObj.profile.social.instagram
                      ? props.profileObj.profile.social.instagram
                      : "n/a"
                  }
                />
              </ListItem>

              <ListItem disablePadding={true} sx={{ mt: 1 }}>
                <ListItemIcon>
                  <TwitterIcon fontSize="large" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    props.profileObj.profile.social &&
                    props.profileObj.profile.social.twitter
                      ? props.profileObj.profile.social.twitter
                      : "n/a"
                  }
                />
              </ListItem>

              <ListItem disablePadding={true} sx={{ mt: 1 }}>
                <ListItemIcon>
                  <YouTubeIcon fontSize="large" sx={{ color: red[800] }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    props.profileObj.profile.social &&
                    props.profileObj.profile.social.youtube
                      ? props.profileObj.profile.social.youtube
                      : "n/a"
                  }
                />
              </ListItem>
            </List>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: "30%", objectFit: "cover" }}
          image={props.profileObj.profile.user.profilePicUrl}
          alt="Live from space album cover"
        />
      </Card>

      <ProfilePostDisplayer
        profileObj={props.profileObj}
        viewingUser={props.viewingUser}
      />
    </Box>
  );
};
export default Profile;
