import { Layout } from "components";
import { useRouter } from "next/router";
import React, { SetStateAction, Dispatch, useState, useEffect } from "react";
import { Grid, Box, Typography, Button, Theme } from "@material-ui/core";
import MaterialLink from "@material-ui/core/Link";
import Alert from "@material-ui/lab/Alert";
import { makeStyles, createStyles } from "@material-ui/styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { FormikField } from "../components/";
import { authenticate, isAuth } from "utils/auth";
import Link from "next/link";
import { HowToVoteRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formBox: {
      marginTop: "2rem",
      width: "50%",
    },

    linkStyles: {
      display: "block",
      textAlign: "right",
      color: theme.palette.secondary.main,
    },
  })
);

interface Props {}

interface FormValuesType {
  email: string;
  password: string;
}

const initialFormValues: FormValuesType = {
  email: "yogeshvishnole@gmail.com",
  password: "password",
};

const loginSchema = Yup.object().shape({
  email: Yup.string(),
  password: Yup.string(),
});

const Login: React.FC<Props> = (props) => {
  const [error, setError] = useState("");
  const [buttonText, setButtonText] = useState("Login");

  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) {
        setError("");
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (isAuth()) {
      router.push("/");
    }
  }, [isAuth]);

  const handleSubmit = async (values: FormValuesType, { resetForm }) => {
    setButtonText("Submitting");
    const { email, password } = values;
    try {
      const res = await axios.post(`/api/v1/auth/login`, {
        email,
        password,
      });
      resetForm({
        values: {
          email: "",
          password: "",
        },
      });
      authenticate(res.data, () => {
        const isAuthenticated = isAuth();
        if (isAuthenticated) {
          isAuthenticated.role === "admin"
            ? router.push("/admin")
            : router.push("/user");
        }
      });
    } catch (e) {
      setError(e.response.data.message);
      setButtonText("Login");
    }
  };

  return (
    <Layout>
      <Grid container direction="column" justify="center" alignItems="center">
        <Box className="formBox">
          <Typography component="h1" variant="h4" className="formHead">
            Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Formik
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            validationSchema={loginSchema}
          >
            {({ dirty, isValid }) => (
              <Form>
                <Grid item>
                  <FormikField
                    name="email"
                    label="Email"
                    type="email"
                    required
                  />
                </Grid>
                <Grid item>
                  <FormikField
                    name="password"
                    label="password"
                    type="password"
                    required
                  />
                </Grid>

                <Button variant="contained" color="primary" type="submit">
                  {buttonText}
                </Button>
              </Form>
            )}
          </Formik>
          <Link href="/auth/forgot-password" passHref>
            <MaterialLink underline="hover" className={classes.linkStyles}>
              <Typography>Forgot Password</Typography>
            </MaterialLink>
          </Link>
        </Box>
      </Grid>
    </Layout>
  );
};

export default Login;
