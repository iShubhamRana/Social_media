import React, { useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import FetchedUserObj from "../../types/FetchedUserTypes";
import FetchedProfile from "../../types/FetchedProfile";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, useForkRef } from "@mui/material";
import TextField from "@mui/material/TextField";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import ProfilePostDisplayer from "./ProfilePostDisplayer";
import Backdrop from "../BackDrop";
import useSnackbar from "../../customhooks/useSnackbar";
import SnackbarComponent from "../../components/SnackBar";
import uploadPic from "../../utilsServer/cloudinaryUpload";
import baseUrl from "../../utilsServer/base";
import axios from "axios";
import cookie from "js-cookie";

type ProfileProps = {
  viewingUser: FetchedUserObj | null;
  profileObj: FetchedProfile;
  fetchProfile: () => void;
};
const UpdateProfile = (props: ProfileProps) => {
  type formDetails = {
    profilepic: string;
    bio: string;
    youtube: string;
    instagram: string;
    twitter: string;
  };

  const [profile, setprofile] = useState<formDetails>({
    profilepic: props.profileObj.profile.user.profilePicUrl,
    bio: props.profileObj.profile.bio,
    youtube: props.profileObj.profile.social.youtube,
    instagram: props.profileObj.profile.social.instagram,
    twitter: props.profileObj.profile.social.twitter,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { showSnackbar, message, snackbarTrigger, handleShowSnackbar } =
    useSnackbar();

  const [media, setMedia] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setprofile((prev)=>{...prev , [e.target.name]:e.target.value});
    setprofile((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetching(true);
    let picurl: null | string = null;
    if (media) {
      picurl = await uploadPic(media);
    }

    console.log(profile);

    const Token = cookie.get("Token");
    axios
      .put(
        `${baseUrl}/api/profile/updateProfile`,
        {
          profilepic: picurl === null ? profile.profilepic : picurl,
          bio: profile.bio,
          instagram: profile.instagram,
          twitter: profile.twitter,
          youtube: profile.youtube,
        },
        {
          headers: {
            Authorization: Token,
          },
        }
      )
      .then((res) => {
        setFetching(false);
        snackbarTrigger({ message: res.data, type: "success" });
        props.fetchProfile();
      })
      .catch((err) => {
        setFetching(false);
        snackbarTrigger({ message: err.response.data, type: "success" });
        props.fetchProfile();
      });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setprofile((prev) => {
        return { ...prev, ["profilepic"]: url };
      });
    }
  };

  const [fetching, setFetching] = useState<boolean>(false);

  return (
    <Box
      sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 5 }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Backdrop open={fetching} />
      <SnackbarComponent
        open={showSnackbar}
        handlerFunction={handleShowSnackbar}
        message={message.message}
        behaviour={message.type}
      />
      <input
        style={{ display: "none" }}
        type="file"
        accept="image/gif, image/jpeg, image/png"
        onChange={handleUpload}
        name="media"
        ref={inputRef}
      ></input>

      <Card sx={{ width: "80%" }}>
        <CardMedia
          sx={{ height: 400 }}
          image={`${profile.profilepic}`}
          title="green iguana"
        />
        <CardContent>
          <Button
            variant="outlined"
            sx={{ ml: "auto" }}
            onClick={() => {
              inputRef.current!.click();
            }}
          >
            Upload Image
          </Button>
          <br></br>
          <TextField
            id="outlined-helperText"
            label="Bio"
            defaultValue={profile.bio}
            sx={{ width: "90%", mt: 2 }}
            multiline
            rows={3}
            name="bio"
            value={profile.bio}
            onChange={handleChange}
          />
        </CardContent>
        <Button variant="contained" sx={{ ml: 2 }}>
          Socials
        </Button>
        <br></br>

        <TextField
          id="standard-helperText"
          label="Youtube"
          defaultValue={profile.instagram}
          sx={{ ml: 2, width: "50%", mt: 2 }}
          name="youtube"
          value={profile.youtube}
          onChange={handleChange}
        />

        <TextField
          id="standard-helperText"
          label="Instagram"
          defaultValue={profile.instagram}
          sx={{ ml: 2, width: "50%", mt: 2 }}
          name="instagram"
          value={profile.instagram}
          onChange={handleChange}
        />

        <TextField
          id="standard-helperText"
          label="Twitter"
          defaultValue={profile.twitter}
          sx={{ ml: 2, width: "50%", mt: 2 }}
          name="twitter"
          value={profile.twitter}
          onChange={handleChange}
        />

        <br></br>

        <Button
          variant="contained"
          sx={{ ml: 2, m: 2 }}
          endIcon={<UpgradeIcon fontSize="large" />}
          type="submit"
          disabled={fetching}
        >
          Update
        </Button>
      </Card>
    </Box>
  );
};
export default UpdateProfile;
