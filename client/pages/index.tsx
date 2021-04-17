import { useState, useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import axios from "axios";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Badge,
} from "@material-ui/core";

import { Layout } from "components";
import CategoryGrid from "../components/CategoryGrid";
import { Category } from "types";
import moment from "moment";

const Home = ({
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [trendingLinks, setTrendingLinks] = useState([]);

  useEffect(() => {
    loadTrendingLinks();
  }, []);

  const loadTrendingLinks = async () => {
    const response = await axios.get("/api/v1/links/popular");
    setTrendingLinks(response.data.data.data);
  };

  const incrementLinkClick = async (linkId) => {
    console.log("linkId", linkId);
    const response = await axios.patch(`/api/v1/links/click-count`, {
      linkId,
    });
    loadTrendingLinks();
  };

  const showLinks = () => {
    return (
      <Grid container direction="column" spacing={2}>
        {trendingLinks &&
          trendingLinks.map((link, i) => {
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
      <CategoryGrid categories={categories} />
      <Typography variant="h4" style={{ marginTop: "2rem" }}>
        Trending Links
      </Typography>
      <Grid container style={{ marginTop: "1rem" }}>
        {showLinks()}
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let categories: Category[];
  try {
    const response = await axios.get(
      `${process.env.API_HOST}/api/v1/categories`
    );
    categories = response.data.data.categories;
  } catch (err) {
    console.log(err);
    categories = [];
  }
  return {
    props: {
      categories,
    },
  };
};

export default Home;
