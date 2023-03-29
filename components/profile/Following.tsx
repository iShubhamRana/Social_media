import { useEffect, useState } from "react";
import FetchedUserObj from "../../types/FetchedUserTypes";
import FetchedProfile from "../../types/FetchedProfile";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import FolderIcon from "@mui/icons-material/Folder";
import Button from "@mui/material/Button";
import axios from "axios";
import baseUrl from "../../utilsServer/base";
import cookie from "js-cookie";
import FollowerCard from "./FollowerCard";
import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import unfollow from "../../utils/unfollow";
import follow from "../../utils/follow";
import useSnackbar from "../../customhooks/useSnackbar";
import SnackbarComponent from "../SnackBar";

type FollowingProps = {
  viewingUser: FetchedUserObj | null;
  profileObj: FetchedProfile;
  fetchProfile: () => void;
};
const Followers = (props: FollowingProps) => {
  const [followers, setFollowers] = useState<{ user: FetchedUserObj }[] | null>(
    null
  );

  const [fetching, setisFetching] = useState<boolean>(true);

  const { showSnackbar, message, snackbarTrigger, handleShowSnackbar } =
    useSnackbar();

  //for the user who is viewing
  const [followstats, setfollowstats] = useState<{
    followers: { user: string }[];
    following: { user: string }[];
  } | null>(null);

  const handleFollow = (to: string) => {
    if (!props.viewingUser) return;

    follow(to)
      .then((res) => {
        props.fetchProfile();
        getViewingUserFollowStats();
        setisFetching(false);
        snackbarTrigger({
          message: "Followed successfully",
          type: "success",
        });
      })
      .catch((err) => {
        props.fetchProfile();
        getViewingUserFollowStats();
        setisFetching(false);
        snackbarTrigger({ message: err.response.data, type: "error" });
      });
  };

  const handleUnFollow = (to: string) => {
    if (!props.viewingUser) return;
    setisFetching(true);
    unfollow(to)
      .then((res) => {
        props.fetchProfile();
        getViewingUserFollowStats();
        setisFetching(false);
        snackbarTrigger({
          message: "Unfollowed successfully",
          type: "success",
        });
      })
      .catch((err) => {
        props.fetchProfile();
        getViewingUserFollowStats();
        setisFetching(false);
        snackbarTrigger({ message: err.response.data, type: "error" });
      });
  };

  const getfollowers = () => {
    const Token = cookie.get("Token");
    axios
      .get(
        `${baseUrl}/api/profile/following/${props.profileObj.profile.user._id}`,
        {
          headers: {
            Authorization: Token,
          },
        }
      )
      .then((res) => {
        setFollowers(res.data.following);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getViewingUserFollowStats = () => {
    if (!props.viewingUser) return;
    const Token = cookie.get("Token");
    axios
      .get(`${baseUrl}/api/profile/getfollowstats/${props.viewingUser._id}`, {
        headers: {
          Authorization: Token,
        },
      })
      .then((res) => {
        setfollowstats(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getfollowers();
    getViewingUserFollowStats();
  }, []);

  // console.log(!followers || (props.viewingUser && !followstats);

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <SnackbarComponent
        open={showSnackbar}
        handlerFunction={handleShowSnackbar}
        message={message.message}
        behaviour={message.type}
      />
      <Paper sx={{ width: "80%", mt: 5, textAlign: "center" }}>
        {!followers || (props.viewingUser && !followstats) ? (
          <CircularProgress />
        ) : followers.length > 0 ? (
          <List dense={true}>
            {followers.map((follower, index) => {
              return (
                <FollowerCard
                  key={index}
                  viewing_user={props.viewingUser}
                  displayed_user={follower.user}
                  handleFollow={handleFollow}
                  handleUnFollow={handleUnFollow}
                  followstats={followstats}
                  fetching={fetching}
                />
              );
            })}
          </List>
        ) : (
          <Typography variant="h5" sx={{ fontWeight: "400", p: 5 }}>
            {" "}
            No followers Found
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
export default Followers;
