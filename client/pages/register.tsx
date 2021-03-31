import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "components";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { Formik, Form } from "formik";
import axios from "axios";
import * as Yup from "yup";

import { FormikField } from "components/";
import { isAuth } from "utils/auth";

interface RegisterProps {}

interface FormValuesType {
  name: string;
  email: string;
  password: string;
}

const initialValues: FormValuesType = {
  name: "",
  email: "",
  password: "",
};

const signUpSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too short").required("Required"),
  email: Yup.string().email(),
  password: Yup.string().min(2, "Too short").required("Required"),
});

const Register: React.FC<RegisterProps> = (props) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Register");

  const classes = useStyles();
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
    if (isAuth()) {
      router.push("/");
    }
  }, [isAuth]);

  const handleSubmit = async (values: FormValuesType, { resetForm }) => {
    setButtonText("Submitting");
    const { name, email, password } = values;
    try {
      const res = await axios.post(`/api/v1/auth/register`, {
        name,
        email,
        password,
      });
      resetForm({
        values: {
          name: "",
          email: "",
          password: "",
        },
      });
      setSuccess(res.data.message);
      setButtonText("Submitted");
    } catch (e) {
      setError(e.response.data.message);
      setButtonText("Register");
    }
  };

  return (
    <Layout>
      <Grid container direction="column" justify="center" alignItems="center">
        <Box className="formBox">
          <Typography component="h1" variant="h4" className="formHead">
            Register
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
                    label="Email"
                    type="email"
                    required
                  />
                </Grid>
                <Grid item>
                  <FormikField
                    name="password"
                    label="Password"
                    type="password"
                    required
                  />
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!dirty || !isValid}
                  type="submit"
                >
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

export default Register;
