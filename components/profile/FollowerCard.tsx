import FetchedUserObj from "../../types/FetchedUserTypes";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DoneIcon from "@mui/icons-material/Done";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Router from "next/router";

//followstats will be considered only when vieing_user if present
type FollowerCardProps = {
  displayed_user: FetchedUserObj;
  viewing_user: FetchedUserObj | null;
  handleFollow: (to: string) => void;
  handleUnFollow: (to: string) => void;
  followstats: {
    followers: { user: string }[];
    following: { user: string }[];
  } | null;
  fetching: boolean;
};

const FollowerCard = (props: FollowerCardProps) => {
  const [fetching, setFetching] = useState<boolean>(false);

  const followHandler = () => {
    props.handleFollow(props.displayed_user._id);
  };

  const unFollowHandler = () => {
    props.handleUnFollow(props.displayed_user._id);
  };

  const unfollowbutton = props.followstats?.following.find(
    (to) => to.user == props.displayed_user._id
  );

  const nobutton =
    !props.viewing_user || props.viewing_user._id === props.displayed_user._id;

  return (
    <ListItem
      sx={{ mt: 1 }}
      secondaryAction={
        !fetching ? (
          nobutton ? (
            <></>
          ) : unfollowbutton ? (
            <Button
              variant="outlined"
              endIcon={<DoneIcon />}
              disableElevation
              onClick={unFollowHandler}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<PersonAddIcon />}
              disableElevation
              onClick={followHandler}
            >
              Follow
            </Button>
          )
        ) : (
          <Button
            variant="contained"
            endIcon={<PersonAddIcon />}
            disableElevation
          >
            <CircularProgress />
          </Button>
        )
      }
    >
      <ListItemAvatar style={{ cursor: "pointer" }}>
        <Avatar src={props.displayed_user.profilePicUrl}></Avatar>
      </ListItemAvatar>

      <ListItemText
        style={{ cursor: "pointer" }}
        onClick={() => {
          Router.push(`/${props.displayed_user.username}`);
        }}
        primary={props.displayed_user.username}
        // secondary={secondary ? "Secondary text" : null}
      />
    </ListItem>
  );
};

export default FollowerCard;
