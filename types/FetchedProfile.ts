import ProfileObj from "./ProfileType";
import FetchedUserObj from "./FetchedUserTypes";
import { Types } from "mongoose";
type FetchedProfile = {
  profile: {
    user: FetchedUserObj;
    bio: string;
    social: {
      youtube: string;
      instagram: string;
      twitter: string;
    };
  };
  following: { user: string }[];
  followers: { user: string }[];
};
export default FetchedProfile;

// export type fullFetchedProfile = {
//   profile: {
//     user: FetchedUserObj;
//     bio: string;
//     social?: {
//       youtube?: string;
//       instagram?: string;
//       twitter?: string;
//     };
//   };
//   following: Fe[];
//   followers: { _id: string }[];
// };
