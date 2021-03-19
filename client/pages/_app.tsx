import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "styles/theme";
import "styles/global-styles.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../public/nprogress.css";

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <Component {...pageProps} value={value} setValue={setValue} />
    </MuiThemeProvider>
  );
};

export default MyApp;
