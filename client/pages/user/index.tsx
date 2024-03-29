import { useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { pipeProps } from "next-pipe-props";
import Link from "next/link";
import {
  Grid,
  Typography,
  Divider,
  ListItem,
  List,
  Card,
  CardContent,
  Chip,
  Badge,
} from "@material-ui/core";
import moment from "moment";
import axios from "axios";

import { roleSubscriber, withUser } from "utils/pipeFunctions";
import { Layout } from "../../components";

interface Props {}

const User: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  user,
  userLinks,
  token,
}) => {
  const [linkState, setLinkState] = useState(userLinks);

  const confirmDelete = async (id) => {
    const answer = window.confirm(
      "Are you sure you wanted to delete ths link  ? "
    );
    if (answer) {
      const response = await axios.delete(`/api/v1/links/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      });
      loadUserLinks();
    }
  };

  const showListLinks = () => {
    return (
      <Grid container direction="column" spacing={2}>
        {linkState &&
          linkState.map((link, i) => {
            return (
              <Grid item>
                <Card style={{ backgroundColor: "#D1ECF1" }}>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={8}>
                        <a href={link.url} target="_blank">
                          <Typography>{link.title}</Typography>
                          <Typography
                            style={{ fontSize: "14px", color: "red" }}
                          >
                            {link.url}
                          </Typography>
                        </a>
                      </Grid>
                      <Grid container item xs={4} justify="flex-end">
                        <Grid item>
                          <Typography style={{ fontSize: "14px" }}>
                            {moment(link.createdAt).fromNow()}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Chip key={i} label={`${link.clicks} clicks`} />
                        </Grid>
                      </Grid>
                      <Grid item xs={8}>
                        <Badge badgeContent="">
                          <Typography style={{ marginRight: "2px" }}>
                            {link.type} / {link.medium}
                          </Typography>
                        </Badge>
                        {link.categories.map((c, i) => (
                          <Chip key={i} label={c.name} />
                        ))}
                      </Grid>
                      <Grid container item xs={4} justify="flex-end">
                        <Link href={`/user/link/${link._id}`}>
                          <Chip
                            label={`Update`}
                            style={{
                              marginLeft: "2px",
                              cursor: "pointer",
                            }}
                          />
                        </Link>
                        <Chip
                          onClick={(e) => confirmDelete(link._id)}
                          label={`Delete`}
                          style={{
                            marginLeft: "2px",
                            cursor: "pointer",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    );
  };

  const loadUserLinks = async () => {
    const response = await axios.get(`/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });
    setLinkState(response.data.data.links);
  };

  return (
    <Layout>
      <Typography variant="h4" style={{ marginBottom: "1rem" }}>
        {user.name}'s Dashboard /{" "}
        <span style={{ color: "red" }}>{user.role}</span>{" "}
      </Typography>
      <Divider />
      <Grid container spacing={3}>
        <Grid container item direction="column" md={4}>
          <List component="nav">
            <ListItem>
              <Link href="/user/link/create">
                <a>
                  <Typography>Submit a link</Typography>
                </a>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="/user/profile/update">
                <a>
                  <Typography>Update profile</Typography>
                </a>
              </Link>
            </ListItem>
          </List>
        </Grid>
        <Grid container item direction="column" md={8}>
          <Typography variant={"h5"} style={{ marginTop: "1rem" }}>
            Your Links
          </Typography>
          <Divider />
          <Typography>{showListLinks()}</Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = pipeProps(
  withUser,
  roleSubscriber
);

export default User;
