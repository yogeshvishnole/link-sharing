import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Formik, Form } from "formik";
import * as yup from "yup";

import { Layout } from "../../../components/";
import { FormikField } from "../../../components";
import axios from "axios";

interface Props {}

interface FormValuesType {
  newPassword: string;
}

const initialFormValues: FormValuesType = {
  newPassword: "",
};

const formValuesSchema = yup.object().shape({
  newPassword: yup.string().min(2, "Too short").required("Required"),
});

const ResetPassword: React.FC<Props> = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetPasswordLink, setResetPasswordLink] = useState("");
  const [name, setName] = useState("");
  const [buttonText, setButtonText] = useState("Reset Password");

  const router = useRouter();

  useEffect(() => {
    let timeout;
    if (error || success) {
      timeout = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [error, success]);

  useEffect(() => {
    const token = router.query.id as string;
    if (token) {
      setName(jwt.decode(token).name);
      setResetPasswordLink(token);
    }
  }, [router]);

  const handleSubmit = async (
    { newPassword }: FormValuesType,
    { resetForm }
  ) => {
    setButtonText("Resetting...");
    try {
      const response = await axios.patch("/api/v1/auth/reset-password", {
        resetPasswordLink,
        newPassword,
      });
      setSuccess(response.data.message);
      setButtonText("Done");
      resetForm({ newPassword: "" });
    } catch (err) {
      setError(err.response.data.message);
      setButtonText("Reset Password");
    }
  };

  return (
    <Layout>
      <Grid container direction="column" justify="center" alignItems="center">
        <Box className="formBox">
          <Typography component="h1" variant="h5">
            Hey {name}! Ready to reset your password
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Formik
            initialValues={initialFormValues}
            validationSchema={formValuesSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid item>
                <FormikField name="newPassword" label="Type new password" />
              </Grid>
              <Button variant="contained" color="primary" type="submit">
                {buttonText}
              </Button>
            </Form>
          </Formik>
        </Box>
      </Grid>
    </Layout>
  );
};

export default ResetPassword;
