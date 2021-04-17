import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import axios from "axios";
import parse from "html-react-parser";
import Head from "next/head";
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

import Layout from "../../components/layout";
import moment from "moment";

const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");

const Links = ({
  query,
  category,
  links,
  linkLimit,
  linkSkip,
  totalLinks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [allLinks, setAllLinks] = useState(links);
  const [popularLinks, setPopularLinks] = useState([]);
  const [limit, setLimit] = useState(linkLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [linkCount, setLinkCount] = useState(totalLinks);

  const head = () => (
    <Head>
      <title>
        {category.name} | {process.env.APP_NAME}
      </title>
      <meta
        name="description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      <meta property="og:title" content={category.name} />
      <meta
        property="og:description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      <meta property="og:image" content={category.image.url} />
      <meta property="og:image:secure_url" content={category.image.url} />
    </Head>
  );

  useEffect(() => {
    loadPopularLinks();
  }, []);

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`/api/v1/categories/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...response.data.data.links]);
    setLinkCount(response.data.data.links.length);
    setSkip(toSkip);
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`/api/v1/categories/${query.slug}`);
    setAllLinks(response.data.data.links);
  };

  const incrementLinkClick = async (linkId) => {
    console.log("linkId", linkId);
    const response = await axios.patch(`/api/v1/links/click-count`, { linkId });
    loadUpdatedLinks();
    loadPopularLinks();
  };

  const loadPopularLinks = async () => {
    const response = await axios.get(`/api/v1/links/popular/${category._id}`);

    setPopularLinks(response.data.data.data);
  };

  const showPopularLinks = () => {
    return (
      <Grid container direction="column" spacing={2}>
        {popularLinks &&
          popularLinks.map((link, i) => {
            return (
              <Grid item>
                <Card style={{ backgroundColor: "#ff8484" }}>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs={8}
                        onClick={(e) => incrementLinkClick(link._id)}
                      >
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
                      <Grid item xs={12}>
                        <Badge badgeContent="">
                          <Typography style={{ marginRight: "2px" }}>
                            {link.type} / {link.medium}
                          </Typography>
                        </Badge>
                        {link.categories.map((c, i) => (
                          <Chip key={i} label={c.name} />
                        ))}
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
                      <Grid
                        item
                        xs={8}
                        onClick={(e) => incrementLinkClick(link._id)}
                      >
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
                      <Grid item xs={12}>
                        <Badge badgeContent="">
                          <Typography style={{ marginRight: "2px" }}>
                            {link.type} / {link.medium}
                          </Typography>
                        </Badge>
                        {link.categories.map((c, i) => (
                          <Chip key={i} label={c.name} />
                        ))}
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
    <>
      {head()}
      <Layout>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              <Typography variant="h4" style={{ marginBottom: "1rem" }}>
                {category.name} - URL/Links
              </Typography>
              <Grid item>
                <Card style={{ backgroundColor: "lightgrey" }}>
                  <CardContent>
                    <Typography>{parse(category.content)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <img
              src={category.image.url}
              alt={category.name}
              style={{ width: "auto", maxHeight: "200px" }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={8}>
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
          <Grid item xs={4}>
            <Typography>Most popular in {category.name}</Typography>
            {showPopularLinks()}
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  let skip = 0;
  let limit = 2;
  let category, links;
  try {
    const response = await axios.post(
      `${process.env.API_HOST}/api/v1/categories/${query.slug}`,
      { skip, limit }
    );
    category = response.data.data.category;
    links = response.data.data.links;
  } catch (err) {
    console.log(err);
    (category = {}), (links = []);
  }
  return {
    props: {
      category,
      links,
      query,
      linkLimit: limit,
      linkSkip: skip,
      totalLinks: links.length,
    },
  };
};

export default Links;
