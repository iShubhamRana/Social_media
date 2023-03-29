import { useEffect, useState, SyntheticEvent } from "react";
import FetchedUserObj from "../types/FetchedUserTypes";
import fetchUser from "../utilsServer/fetchUser";
import FetchedProfile from "../types/FetchedProfile";
import axios from "axios";
import baseUrl from "../utilsServer/base";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import Layout from "../components/Layout";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import Profile from "../components/profile/Profile";
import Followers from "../components/profile/Followers";
import Following from "../components/profile/Following";
import Settings from "../components/profile/Settings";
import UpdateProfile from "../components/profile/UpdateProfile";
import { Paper } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const ProfilePage = () => {
  const [viewingUser, setViewingUser] = useState<FetchedUserObj | null>(null);
  const [profile, setProfile] = useState<FetchedProfile | null>(null);

  //value for tab
  const profile_username = useRouter().query.userId;
  const [tabvalue, settabvalue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    settabvalue(newValue);
  };

  const fetchProfile = () => {
    const Token = cookie.get("Token");
    // console.log(profile_user_id);
    axios
      .get(`${baseUrl}/api/profile/${profile_username}`, {
        headers: {
          authorization: Token,
        },
      })
      .then((res) => {
        setProfile(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    fetchProfile();
    fetchUser().then((res) => {
      setViewingUser(res);
    });
    settabvalue(0);

    // codes using router.query
  }, [router.isReady, router.query.userId]);

  if (profile && viewingUser)
    return (
      <Layout user={viewingUser} isProtected={false}>
        {profile ? (
          <>
            <Paper sx={{p:2}}>
              <Tabs
                value={tabvalue}
                onChange={handleChange}
                aria-label="secondary tabs example"
                sx={{ textTransform: "none" }}
              >
                <Tab value={0} label="Profile" />
                <Tab
                  value={1}
                  label={`${profile.followers.length} Followers`}
                />
                <Tab
                  value={2}
                  label={`${profile.following.length} Following`}
                />
                {viewingUser &&
                  viewingUser._id === profile.profile.user._id && (
                    <Tab value={3} label="Update Profile" />
                  )}
                {viewingUser &&
                  viewingUser._id === profile.profile.user._id && (
                    <Tab value={4} label="Settings" />
                  )}
              </Tabs>
            </Paper>

            {tabvalue === 0 && (
              <Profile
                profileObj={profile}
                viewingUser={viewingUser}
                fetchProfile={fetchProfile}
              />
            )}
            {tabvalue === 1 && (
              <Followers
                profileObj={profile}
                viewingUser={viewingUser}
                fetchProfile={fetchProfile}
              />
            )}
            {tabvalue === 2 && (
              <Following
                profileObj={profile}
                viewingUser={viewingUser}
                fetchProfile={fetchProfile}
              />
            )}
            {tabvalue === 3 && (
              <UpdateProfile
                profileObj={profile}
                viewingUser={viewingUser}
                fetchProfile={fetchProfile}
              />
            )}
            {tabvalue === 4 && (
              <Settings
                profileObj={profile}
                viewingUser={viewingUser}
                fetchProfile={fetchProfile}
              />
            )}
          </>
        ) : (
          <CircularProgress />
        )}
      </Layout>
    );
};

export default ProfilePage;
