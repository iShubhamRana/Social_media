import Image from "next/image";

type DPprops = {
  src: string;
  height: number;
  width: number;
};
const DPicon = (props: DPprops) => {
  return (
    <Image
      src={props.src}
      width={props.height}
      height={props.width}
      alt="profile"
      style={{ borderRadius: "50%", boxShadow:"0 0 2px black"}}
    />
  );
};

export default DPicon;
