import axios from "axios";

const uploadPic = async (media: File): Promise<string | null> => {
  try {
    console.log(process.env.CLOUDINARY_URL);
    const form = new FormData();
    form.append("file", media);
    form.append("upload_preset", "Genzee");
    form.append("cloud_name", "a.jsb");

    const res = await axios.post(process.env.CLOUDINARY_URL as string, form);
    console.log(res);
    return res.data.url;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export default uploadPic;
