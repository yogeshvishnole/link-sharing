import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { pipeProps } from "next-pipe-props";
import { roleSubscriber, withUser } from "utils/pipeFunctions";
import { Layout } from "../../components";

interface Props {}

const User: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  user,
}) => {
  return <Layout>{JSON.stringify(user)}</Layout>;
};

export const getServerSideProps: GetServerSideProps = pipeProps(
  withUser,
  roleSubscriber
);

export default User;
