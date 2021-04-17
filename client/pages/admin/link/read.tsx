import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { pipeProps } from "next-pipe-props";
import axios from "axios";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Badge,
  Chip,
  Button,
} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroller";
import moment from "moment";

import Layout from "../../../components/layout";
import { withUser, roleAdmin } from "../../../utils/pipeFunctions";

const AllLinksAdmin = ({
  query,
  token,
  links,
  linkLimit,
  linkSkip,
  totalLinks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linkLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [linkCount, setLinkCount] = useState(totalLinks);

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(
      `/api/v1/links/getAll`,
      { skip: toSkip, limit },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAllLinks([...allLinks, ...response.data.data.links]);
    setLinkCount(response.data.data.links.length);
    setSkip(toSkip);
  };

  const confirmDelete = async (id) => {
    const answer = window.confirm(
      "Are you sure you wanted to delete this link  ? "
    );
    if (answer) {
      const response = await axios.delete(`/api/v1/links/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      });
      process.browser && window.location.reload();
    }
  };

  const showLinks = () => {
    return (
      <Grid container direction="column" spacing={2}>
        {allLinks &&
          allLinks.map((link, i) => {
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
                        <Typography style={{ fontSize: "14px" }}>
                          {moment(link.createdAt).fromNow()} by{" "}
                          {link.postedBy.name}
                        </Typography>
                        <Chip key={i} label={`${link.clicks} clicks`} />
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

  return (
    <Layout>
      <Typography variant="h4" style={{ marginBottom: "1rem" }}>
        All links
      </Typography>

      <Grid container>
        <Grid item xs={12}>
          {showLinks()}
          <div className="flex-center" style={{ marginTop: "1rem" }}>
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={linkCount > 0 && linkCount >= limit}
              loader={
                <img
                  width="100px"
                  height="100px"
                  src="/images/loading.webp"
                  alt="Loading..."
                />
              }
            ></InfiniteScroll>
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getLinks = async ({ user, token }) => {
  let skip = 0;
  let limit = 2;
  let links;
  try {
    const response = await axios.post(
      `${process.env.API_HOST}/api/v1/links/getAll`,
      { skip, limit },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    links = response.data.data.links;
  } catch (err) {
    console.log("Get all links error", err);
  }

  return {
    user,
    token,
    links,
    linkLimit: limit,
    linkSkip: skip,
    totalLinks: links.length,
  };
};

export const getServerSideProps: GetServerSideProps = pipeProps(
  withUser,
  roleAdmin,
  getLinks
);

export default AllLinksAdmin;
