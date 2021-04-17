import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { pipeProps } from "next-pipe-props";
import Link from "next/link";
import { Grid, Theme, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import MaterialLink from "@material-ui/core/Link";

import { roleAdmin, withUser } from "utils/pipeFunctions";
import { Layout } from "../../components";

interface Props {}

const Admin: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  user,
}) => {
  const classes = useStyles();
  return (
    <Layout>
      <h1>Admin Dashboard</h1>
      <Grid container spacing={6}>
        <Grid item md={3}>
          <Typography>
            <Link href="/admin/category/create" passHref>
              <MaterialLink underline="hover" className={classes.linkStyles}>
                Create Category
              </MaterialLink>
            </Link>
          </Typography>
          <Typography>
            <Link href="/admin/category/read" passHref>
              <MaterialLink underline="hover" className={classes.linkStyles}>
                Manage Categories
              </MaterialLink>
            </Link>
          </Typography>
          <Typography>
            <Link href="/admin/link/read" passHref>
              <MaterialLink underline="hover" className={classes.linkStyles}>
                Manage Links
              </MaterialLink>
            </Link>
          </Typography>
          <Typography>
            <Link href="/user/profile/update" passHref>
              <MaterialLink underline="hover" className={classes.linkStyles}>
                Update Profile
              </MaterialLink>
            </Link>
          </Typography>
        </Grid>
        {/* <Grid item md={6}>
          <Link href="/admin/category/create" passHref>
            <MaterialLink underline="hover" className={classes.linkStyles}>
              <Typography>Forgot Password</Typography>
            </MaterialLink>
          </Link>
        </Grid> */}
      </Grid>
    </Layout>
  );
};

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    linkStyles: {},
  });
});

export const getServerSideProps: GetServerSideProps = pipeProps(
  withUser,
  roleAdmin
);

export default Admin;
