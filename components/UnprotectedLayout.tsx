import Layout from "./Layout";
import { ReactNode } from "react";
type UnprotectedLayoutProps = {
  children: ReactNode;
};
const UnprotectedLayout = (props: UnprotectedLayoutProps) => {
  return (
    <Layout user={null} isProtected={false}>
      {props.children}
    </Layout>
  );
};
export default UnprotectedLayout;
