import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { pipeProps } from "next-pipe-props";

import { roleAdmin, withUser } from "utils/pipeFunctions";
import { Layout } from "../../components";

interface Props {}

const Admin: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  user,
}) => {
  console.log("helllo", user);
  return <Layout>{JSON.stringify(user)}</Layout>;
};

export const getServerSideProps: GetServerSideProps = pipeProps(
  withUser,
  roleAdmin
);

export default Admin;
