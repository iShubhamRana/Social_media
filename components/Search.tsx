import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AccountCircle from "@mui/icons-material/AccountCircle";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "../utilsServer/base";
import cookie from "js-cookie";
import Message from "../types/MessageType";
import UserObj from "../types/UserType";
import CircularProgress from "@mui/material/CircularProgress";
import { blueGrey } from "@mui/material/colors";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Router from "next/router";

const UserTemplate = (props: {
  username: string;
  name: string;
  profilePicUrl: string;
  index: number;
}) => {
  return (
    <Card sx={{ maxWidth: "100%", cursor: "pointer" }}>
      <CardHeader
        onClick={() => {
          Router.push(`/${props.username}`);
        }}
        avatar={<Avatar aria-label="recipe" src={props.username}></Avatar>}
        title={props.username}
        subheader={props.name}
      />
    </Card>
  );
};

type SearchProps = ProtectedRouteProps;

const Search = (props: ProtectedRouteProps) => {
  const [searchedUser, setSearchedUser] = useState("");
  const [showSnackbar, setShowSnackbar] = useState<boolean | undefined>(false);
  const [isFetching, setisFetching] = useState<boolean>(false);
  const [fetchedUsers, setFetchedUsers] = useState<UserObj[]>([]);
  const [message, setMessage] = useState<Message>({
    message: "",
    type: "success",
  });

  const Token = cookie.get("Token");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedUser(e.target.value);
  };

  useEffect(() => {
    if (searchedUser) {
      setisFetching(true);
      setFetchedUsers([]);
      let searchId = setTimeout(() => {
        axios
          .get(`${baseUrl}/api/features/searchuser/${searchedUser}`, {
            headers: { authorization: Token },
          })
          .then((res) => {
            console.log(res.data);
            setFetchedUsers(res.data);
            setisFetching(false);
          })
          .catch((err) => {
            console.log(err);
            setisFetching(false);
          });
      }, 1000);
      return () => {
        clearInterval(searchId);
        setisFetching(false);
      };
    }
  }, [searchedUser]);

  return (
    <Container
      sx={
        {
          // right: "0px",
          // position: "fixed",
        }
      }
    >
      <Stack>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            width: "90%",
            mb: 3,
          }}
        >
          <AccountCircle sx={{ color: "action.active", mr: 1 }} />
          <TextField
            sx={{ width: "100%" }}
            id="search-user"
            label="Search user"
            variant="standard"
            value={searchedUser}
            type="search-user"
            name="search-user"
            onChange={handleInputChange}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            minHeight: "fit-content",
            maxHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isFetching && <CircularProgress />}
          <Stack sx={{ height: "100%", width: "100%" }}>
            {fetchedUsers.map((user, index) => {
              if (user.username !== props.user?.username) {
                console.log(user.profilePicUrl);
                return (
                  <UserTemplate
                    username={user.username}
                    name={user.name}
                    profilePicUrl={user.profilePicUrl as string}
                    index={index}
                  ></UserTemplate>
                );
              }
            })}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
export default Search;
