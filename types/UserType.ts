type UserObj = {
  name: string;
  email: string;
  password: string;
  username: string;
  profilePicUrl:string;
  newMessagePopup?: boolean;
  unreadMessage?: boolean;
  unreadNotification?: boolean;
  role?: string;
  resetToken?: string;
  expireToken?: number;
};
export default UserObj;
