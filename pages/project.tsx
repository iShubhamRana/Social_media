import { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";


import Box from "@mui/material/Box";

type Obj = {
  H: string;
  L: string;
  W: string;
};

const Project = () => {
  const [objects, setObjects] = useState<Obj[]>([]);

  useEffect(() => {
    axios
      .get(
        "https://esp32-3868a-default-rtdb.firebaseio.com/test/newObjects.json"
      )
      .then((res) => {
        const array = Object.entries(res.data);
        let finalArr: Obj[] = [];
        for (let obj of array) {
          finalArr.push(obj[1] as Obj);
        }
        setObjects(finalArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Box>
      {objects.map((object) => {
        return (
          <div style={{border:"1px solid black"}}>
            <TextField />
            <span>length:{object.L}</span> <span>width:{object.W}</span>
            <span>height:{object.H}</span>
          </div>
        );
      })}
    </Box>
  );
};
export default Project;
