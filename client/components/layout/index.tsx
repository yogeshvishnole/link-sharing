/* tslint:disable */
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import Link from "components/link";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    navBarStyles: {
      backgroundColor: "#FEC134",
    },
    elevation0: {
      boxShadow: "0 0 0 0",
    },
    toolbarMargin: {
      marginBottom: "4em",
    },
  })
);

const routes = [
  { name: "Home", link: "/", activeIndex: 0 },
  {
    name: "Submit a link",
    link: "/submit-a-link",
    activeIndex: 1,
  },
  {
    name: "Login",
    link: "/login",
    activeIndex: 2,
  },
  { name: "register", link: "/register", activeIndex: 3 },
];

interface Props {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}

const Layout: React.FC<Props> = ({ children, value, setValue }) => {
  useEffect(() => {
    routes.forEach((route) => {
      switch (window.location.pathname) {
        case `${route.link}`:
          setValue(route.activeIndex);
          break;
        default:
          break;
      }
    });
  }, [routes]);

  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const Navigation = () => {
    return (
      <>
        <AppBar className={clsx(classes.navBarStyles, classes.elevation0)}>
          <ToolBar>
            <Tabs value={value} onChange={handleChange}>
              {routes.map((route) => (
                <Tab
                  key={route.activeIndex}
                  label={route.name}
                  component={Link}
                  href={route.link}
                />
              ))}
            </Tabs>
          </ToolBar>
        </AppBar>
        <div className={classes.toolbarMargin}></div>
      </>
    );
  };
  return (
    <>
      {Navigation()}
      {children}
    </>
  );
};

export default Layout;
