import { useState, useEffect, useRef } from "react";
import { InferGetServerSidePropsType } from "next";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import {
  Typography,
  Grid,
  Button,
  GridList,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import { CheckboxWithLabel, RadioGroup } from "formik-material-ui";
import { Alert } from "@material-ui/lab";
import * as yup from "yup";

import Layout from "../../../components/layout";
import FormikField from "../../../components/formik-field";
import { getCookie, isAuth } from "../../../utils/auth";
import { linkMedium, linkType } from "types";

interface FormValueTypes {
  title: string;
  url: string;
  categories: string[];
  type: linkType;
  medium: linkMedium;
}

const initialValues: FormValueTypes = {
  title: "",
  url: "",
  categories: [],
  type: "free",
  medium: "book",
};

const linkSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  url: yup.string().required("URL is required"),
});

const create = ({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [state, setState] = useState({
    loadedCategories: [],
    error: "",
    success: "",
    btnText: "Post",
  });

  const handleSubmit = async (values: FormValueTypes, { resetForm }) => {
    setState({ ...state, btnText: "Loading..." });
    try {
      const response = await axios.post("/api/v1/links", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState({ ...state, btnText: "Post", success: response.data.message });
      resetForm();
    } catch (err) {
      setState({ ...state, btnText: "Post", error: err.response.data.message });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get("/api/v1/categories");
    setState({ ...state, loadedCategories: response.data.data.categories });
  };

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => {
        return (
          <li key={i}>
            <Field
              type="checkbox"
              component={CheckboxWithLabel}
              value={c._id}
              name="categories"
              Label={{ label: c.name }}
            />
          </li>
        );
      })
    );
  };

  const { loadedCategories, error, success, btnText } = state;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success || error) {
        setState({ ...state, error: "", success: "" });
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <Layout>
      <Typography variant="h4">Submit Link/URL</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={linkSchema}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Grid container style={{ marginTop: "2rem" }}>
                <Grid item container direction="column" xs={4}>
                  <Grid item style={{ marginBottom: "1rem" }}>
                    <Typography
                      style={{
                        marginBottom: "1rem",
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      Categories
                    </Typography>

                    <GridList
                      cellHeight="auto"
                      style={{ height: "12rem", width: "90%" }}
                      cols={1}
                    >
                      {showCategories()}
                    </GridList>
                  </Grid>

                  <Grid item style={{ marginBottom: "1rem" }}>
                    <Typography
                      style={{
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      Types
                    </Typography>
                    <GridList
                      cellHeight="auto"
                      style={{ height: "5.5rem", width: "90%" }}
                      cols={1}
                    >
                      <Field component={RadioGroup} name="type">
                        <FormControlLabel
                          value="free"
                          control={<Radio />}
                          label="Free"
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="paid"
                          control={<Radio />}
                          label="Paid"
                          disabled={isSubmitting}
                        />
                      </Field>
                    </GridList>
                  </Grid>

                  <Grid item style={{ marginBottom: "1rem" }}>
                    <Typography
                      style={{
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      Medium
                    </Typography>
                    <GridList
                      cellHeight="auto"
                      style={{ height: "5.5rem", width: "90%" }}
                      cols={1}
                    >
                      <Field component={RadioGroup} name="medium">
                        <FormControlLabel
                          value="video"
                          control={<Radio />}
                          label="Video"
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="book"
                          control={<Radio />}
                          label="Book"
                          disabled={isSubmitting}
                        />
                      </Field>
                    </GridList>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <FormikField name="title" label="Title" type="text" />
                  <FormikField name="url" label="URL" type="text" />
                  <Button
                    disabled={!token}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    {isAuth() ? btnText : "Login to post"}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

export const getServerSideProps = ({ req }) => {
  const token = getCookie("token", req) || null;
  return {
    props: {
      token,
    },
  };
};

export default create;
