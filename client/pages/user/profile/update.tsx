import { useState, useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { pipeProps } from "next-pipe-props";
import { useRouter } from "next/router";
import { Layout } from "components";
import { CheckboxWithLabel } from "formik-material-ui";
import { Grid, Box, Typography, Button, GridList } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import * as Yup from "yup";

import FormikField from "../../../components/formik-field";
import { isAuth, updateUser } from "../../../utils/auth";
import { withUser, getUser } from "../../../utils/pipeFunctions";

interface FormValuesType {
  name: string;
  email: string;
  password: string;
  categories: string[];
}

const signUpSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too short").required("Required"),
});

const UpdateProfile = ({
  user,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Update");
  const [loadedCategories, setLoadedCategories] = useState([]);

  const initialValues: FormValuesType = {
    name: user.name,
    email: user.email,
    password: user.password,
    categories: user.categories,
  };

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success || error) {
        setSuccess("");
        setError("");
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [error, success]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get("/api/v1/categories");
    setLoadedCategories(response.data.data.categories);
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

  const handleSubmit = async (values: FormValuesType, { resetForm }) => {
    setButtonText("Updating...");
    const { name, password, categories } = values;
    console.log("password", password);
    try {
      const res = await axios.patch(
        `/api/v1/users/${user._id}`,
        {
          name,
          password,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = res.data;
      updateUser(data.user, () => {
        resetForm({
          values: {
            name: data.user.name,
            categories: data.user.categories,
          },
        });
        setSuccess(res.data.message);
        setButtonText("Update");
      });
    } catch (e) {
      setError(e.response.data.message);
      setButtonText("Update");
    }
  };

  return (
    <Layout>
      <Grid container direction="column" justify="center" alignItems="center">
        <Box className="formBox">
          <Typography component="h1" variant="h4" className="formHead">
            Update your profile
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={signUpSchema}
          >
            {({ dirty, isValid }) => (
              <Form>
                <Grid item>
                  <FormikField name="name" label="Name" required />
                </Grid>
                <Grid item>
                  <FormikField
                    name="email"
                    type="email"
                    required
                    disabled={true}
                  />
                </Grid>
                <Grid item>
                  <FormikField
                    name="password"
                    label="Password"
                    type="password"
                    required={false}
                  />
                </Grid>
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
                <Button variant="contained" color="primary" type="submit">
                  {buttonText}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = pipeProps(
  withUser,
  getUser
);

export default UpdateProfile;
