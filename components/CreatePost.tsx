import { useState, useRef, useCallback } from "react";
import ProtectedRouteProps from "../types/ProtectedRouteProps";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FormControl from "@mui/material/FormControl";
import ImageDrop from "./ImageDrop";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import uploadPic from "../utilsServer/cloudinaryUpload";
import axios from "axios";
import baseUrl from "../utilsServer/base";
import cookie from "js-cookie";
import SimpleBackdrop from "./BackDrop";
import DeleteIcon from "@mui/icons-material/Delete";
import { Paper } from "@mui/material";

type CreatePostProps = ProtectedRouteProps;
const CreatePost = (props: CreatePostProps) => {
  type PostObj = {
    text: string;
    location: string;
    picUrl: string;
    likes: string[];
    comments: string[];
    user: string;
  };

  const initialPostData: PostObj = {
    text: "",
    location: "",
    picUrl: "",
    likes: [],
    comments: [],
    user: props.user?._id as string,
  };
  const [postData, setPostData] = useState<PostObj>(initialPostData);

  const [showadditional, setShowAdditional] = useState<boolean>(false);

  //for imageDrop component
  const inputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<null | File>(null);
  const [mediaPreview, setMediaPreview] = useState<null | string>(null);
  const [highlighted, setHighlighted] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(e.target.files[0]);
      setMediaPreview(URL.createObjectURL(e.target.files[0]));
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPostData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    },
    []
  );
  //ends here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let picUrl: string = "";
    if (media) {
      picUrl = (await uploadPic(media)) || "";
    }

    const Token = cookie.get("Token");

    axios
      .post(
        `${baseUrl}/api/posts/`,
        { post: { ...postData, picUrl } },
        {
          headers: { authorization: Token },
        }
      )
      .then((res) => {
        handlereset();
        setMedia(null);
        setMediaPreview(null);
        setHighlighted(false);
        setUploading(false);
        console.log(res);
      })
      .catch((err) => {
        handlereset();
        setMedia(null);
        setMediaPreview(null);
        setHighlighted(false);
        setUploading(false);
        console.log(err);
      });
  };

  const handlereset = useCallback(() => {
    setPostData(initialPostData);
    setShowAdditional(false);
  }, []);

  return (
    <Paper
      component="form"
      sx={{
        width: "85%",
        p: 1.5,
        borderRadius: "10px",
        background: "#fff",
        border: "1px solid lightgrey",
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      elevation={2}
    >
      {uploading && <SimpleBackdrop open={uploading} />}
      <Box component="div" sx={{ width: "100% ", p: 1 }}>
        <Image
          src={props.user?.profilePicUrl as string}
          width={40}
          height={40}
          alt="profilepic"
          style={{ borderRadius: "50%" }}
        />
        <TextField
          id="text"
          multiline
          maxRows={4}
          placeholder="What's in your mind?"
          sx={{ width: "90%", ml: 1 }}
          name="text"
          value={postData.text}
          onClick={() => {
            setShowAdditional(true);
          }}
          onChange={handleInputChange}
        />
      </Box>

      {showadditional && (
        <FormControl sx={{ width: "80%" }} variant="outlined">
          <OutlinedInput
            id="location"
            name="location"
            type="text"
            value={postData.location}
            endAdornment={
              <InputAdornment position="end">
                <LocationOnIcon />
              </InputAdornment>
            }
            placeholder="Add location"
            sx={{ height: "40px", width: "50%", mt: 2 }}
            onChange={handleInputChange}
          />
        </FormControl>
      )}

      {showadditional && (
        <ImageDrop
          mediaPreview={mediaPreview}
          setMediaPreview={setMediaPreview}
          setMedia={setMedia}
          handleChange={handleChange}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          inputRef={inputRef}
          sx={{
            p: 2,
            border: "2px dashed grey",
            width: "300px",
            height: "200px",
            mt: 2,
          }}
        >
          <AddIcon fontSize="large" />
        </ImageDrop>
      )}

      {showadditional && (
        <Button
          variant="outlined"
          endIcon={<SendIcon />}
          sx={{ mt: 2, mr: 2 }}
          type="submit"
          disabled={postData.text === ""}
        >
          Post
        </Button>
      )}
      {showadditional && (
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
          endIcon={<DeleteIcon />}
          onClick={handlereset}
        >
          Discard
        </Button>
      )}
    </Paper>
  );
};
export default CreatePost;
