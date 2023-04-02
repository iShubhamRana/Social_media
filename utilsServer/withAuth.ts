import { GetServerSideProps, GetServerSidePropsContext } from "next";
import routeProtection from "./routeProtection";
export default function withAuth(gssp: GetServerSideProps): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const { user, isProtected } = await routeProtection(context);
    console.log(user);
    if (!user) {
      return {
        redirect: { statusCode: 302, destination: "/login" },
      };
    }

    const gsspData = await gssp(context);

    if (!("props" in gsspData)) {
      throw new Error("invalid getSSP result");
    }

    return {
      props: {
        ...gsspData.props,
        user,
        isProtected,
      },
    };
  };
}
