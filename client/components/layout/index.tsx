/* tslint:disable */
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import { List, ListItem, ListItemText, Container } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { authenticate, isAuth, logout } from "utils/auth";

const useStyles = makeStyles((theme) =>
  createStyles({
    navBarStyles: {
      backgroundColor: theme.palette.primary.main,
    },
    elevation0: {
      boxShadow: "0 0 0 0",
    },
    toolbarMargin: {
      marginBottom: "4em",
    },
    activeTab: {
      color: theme.palette.secondary.main,
    },
    navDisplayFlex: {
      display: "flex",
      flex: 1,
      color: "#524f4f",
      justifyContent: "space-betweeen",
    },
    listItem: {
      width: "auto",
    },
    floatRight: {
      marginLeft: "auto",
    },
  })
);

const routes = [
  { name: "Home", link: "/", activeIndex: 0 },
  {
    name: "Submit a link",
    link: "/user/link/create",
    activeIndex: 1,
  },
  {
    name: "Login",
    link: "/login",
    activeIndex: 2,
  },
  { name: "register", link: "/register", activeIndex: 3 },
];

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  // useEffect(() => {
  //   routes.forEach((route) => {
  //     switch (window.location.pathname) {
  //       case `${route.link}`:
  //         setValue(route.activeIndex);
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  // }, [routes]);

  const authenticated = isAuth();

  const classes = useStyles();

  // const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
  //   setValue(newValue);
  // };

  const Navigation = () => {
    return (
      <>
        <AppBar className={clsx(classes.navBarStyles, classes.elevation0)}>
          <ToolBar>
            <List
              component="nav"
              aria-labelledby="main navigation"
              className={classes.navDisplayFlex}
            >
              <Link href="/">
                <ListItem button className={classes.listItem}>
                  <ListItemText primary={"HOME"} />
                </ListItem>
              </Link>
              <Link href="/user/link/create">
                <ListItem button className={classes.listItem}>
                  <ListItemText primary={"SUBMIT A LINK"} />
                </ListItem>
              </Link>
              {!authenticated && (
                <>
                  <Link href="/login">
                    <ListItem
                      button
                      className={clsx(classes.listItem, classes.floatRight)}
                    >
                      <ListItemText primary={"LOGIN"} />
                    </ListItem>
                  </Link>
                  <Link href="/register">
                    <ListItem button className={classes.listItem}>
                      <ListItemText primary={"REGISTER"} />
                    </ListItem>
                  </Link>
                </>
              )}
              {authenticated && authenticated.role === "admin" && (
                <Link href="/admin">
                  <ListItem
                    button
                    className={clsx(classes.listItem, classes.floatRight)}
                  >
                    <ListItemText primary={"ADMIN"} />
                  </ListItem>
                </Link>
              )}
              {authenticated && authenticated.role === "subscriber" && (
                <Link href="/user">
                  <ListItem
                    button
                    className={clsx(classes.listItem, classes.floatRight)}
                  >
                    <ListItemText primary={"USER"} />
                  </ListItem>
                </Link>
              )}
              {authenticated && (
                <ListItem
                  button
                  className={clsx(classes.listItem)}
                  onClick={logout}
                >
                  <ListItemText primary={"LOGOUT"} />
                </ListItem>
              )}
            </List>
            {/* <Tabs value={value} onChange={handleChange}>
              {routes.map((route) => (
                <Tab
                  classes={{ selected: classes.activeTab }}
                  key={route.activeIndex}
                  label={route.name}
                  component={Link}
                  href={route.link}
                />
              ))}
            </Tabs> */}
          </ToolBar>
        </AppBar>
        <div className={classes.toolbarMargin}></div>
      </>
    );
  };
  return (
    <>
      {Navigation()}
      <Container maxWidth="md" style={{ paddingTop: "30px" }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
