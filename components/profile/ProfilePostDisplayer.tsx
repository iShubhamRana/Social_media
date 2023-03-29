import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ImagesDisplayer from "./ImagesDisplayer";
import FetchedUserObj from "../../types/FetchedUserTypes";
import FetchedProfile from "../../types/FetchedProfile";
import TextPosts from "./TextPosts";


type ProfilePostDisplayerProps = {
  viewingUser: FetchedUserObj | null;
  profileObj: FetchedProfile;
};

const ProfilePostDisplayer = (props: ProfilePostDisplayerProps) => {
  const [tabvalue, settabvalue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    settabvalue(newValue);
  };
  return (
    <>
      <Tabs
        value={tabvalue}
        onChange={handleChange}
        aria-label="secondary tabs example"
        sx={{ textTransform: "none", mt: 5 }}
      >
        <Tab value={0} label="Images" />
        <Tab value={1} label="Text" />
      </Tabs>

      {tabvalue === 0 && (
        <ImagesDisplayer
          profileObj={props.profileObj}
          viewingUser={props.viewingUser}
        />
      )}
      {tabvalue === 1 && (
        <TextPosts
          profileObj={props.profileObj}
          viewingUser={props.viewingUser}
        />
      )}
    </>
  );
};

export default ProfilePostDisplayer;
