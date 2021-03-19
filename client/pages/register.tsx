import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Layout } from "components";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";

import { FormikField } from "components/";

interface RegisterProps {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const initialValues: FormValues = {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success || error) {
        setSuccess("");
        setError("");
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const classes = useStyles();

  const handleSubmit = async (values: FormValues, { resetForm }) => {
    setButtonText("Submitting");
    const { name, email, password } = values;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );
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
    <Layout {...props}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Box className={classes.formBox}>
          <Typography
            component="h1"
            variant="h4"
            className={classes.registerHead}
          >
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
                  className={classes.submit}
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

const useStyles = makeStyles((theme) =>
  createStyles({
    formBox: {
      marginTop: "2rem",
      width: "50%",
    },
    registerHead: {
      marginBottom: "20px",
    },
    submit: {
      backgroundColor: "#FEC134",
      color: "#fff !important",
      "&:hover": {
        backgroundColor: "#EEC134",
      },
    },
  })
);

export default Register;
