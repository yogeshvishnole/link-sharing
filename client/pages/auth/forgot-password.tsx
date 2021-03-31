import { useEffect, useState } from "react";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Formik, Form, FormikConsumer } from "formik";
import * as yup from "yup";

import { FormikField, Layout } from "../../components/";
import axios from "axios";

interface Props {}

interface FormValuesType {
  email: string;
}

const initialFormValues: FormValuesType = {
  email: "",
};

const formValuesSchema = yup.object().shape({
  email: yup.string().email(),
});

const ForgotPassword: React.FC<Props> = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [buttonText, setButtonText] = useState("Submit");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success || error) {
        setSuccess("");
        setError("");
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleSubmit = async ({ email }: FormValuesType, { resetForm }) => {
    setButtonText("Submitting");
    try {
      const response = await axios.patch("/api/v1/auth/forgot-password", {
        email,
      });
      resetForm({ emai: "" });
      setSuccess(response.data.message);
      setButtonText("Done");
    } catch (err) {
      setError(err.response.data.message);
      setButtonText("Submit");
    }
  };

  return (
    <Layout>
      <Grid container direction="column" justify-="center" alignItems="center">
        <Box className="formBox">
          <Typography component="h1" variant="h4" className="formHead">
            Forgot Password
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Formik
            initialValues={initialFormValues}
            validationSchema={formValuesSchema}
            onSubmit={handleSubmit}
          >
            {({ dirty, isValid }) => {
              return (
                <Form>
                  <Grid item>
                    <FormikField
                      name="email"
                      label="Email"
                      type="email"
                    ></FormikField>
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
              );
            }}
          </Formik>
        </Box>
      </Grid>
    </Layout>
  );
};

export default ForgotPassword;
