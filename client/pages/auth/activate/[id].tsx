import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import axios from "axios";
import jwt from "jsonwebtoken";
import Alert from "@material-ui/lab/Alert";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Container } from "@material-ui/core";

const ActivateAccount = (props) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    error: "",
    success: "",
    btnText: "ACTIVATE YOUR ACCOUNT",
  });

  const router = useRouter();
  const classes = useStyles();

  const { name, token, btnText, error, success } = state;

  useEffect(() => {
    let tokenParam = router.query.id as string;
    if (tokenParam) {
      let { name } = jwt.decode(tokenParam);
      setState({ ...state, name, token: tokenParam });
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success || error) {
        setState({ ...state, error: "", success: "" });
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleActivation = async () => {
    setState({ ...state, btnText: "ACTIVATING" });

    try {
      const response = await axios.post("/api/v1/auth/register/activate", {
        token,
      });
      setState({
        ...state,
        name: "",
        token: "",
        btnText: "ACTIVATED",
        success: response.data.message,
      });
    } catch (err) {
      setState({
        ...state,
        btnText: "ACTIVATE YOUR ACCOUNT",
        error: err.response.data.message,
      });
    }
  };

  return (
    <Container maxWidth="md" className="h-100per">
      <Grid
        container
        spacing={5}
        direction="column"
        alignItems="center"
        className={clsx("h-100per", classes.contentTopPadding)}
      >
        <Grid item>
          <Typography variant="h3" component="h3">
            {`Good day ${name} , Ready to activate your account?`}
          </Typography>
        </Grid>
        {success && (
          <Grid item>
            <Alert severity="success">{success}</Alert>
          </Grid>
        )}
        {error && (
          <Grid item>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleActivation}
          >
            {btnText}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    contentTopPadding: {
      paddingTop: "3rem",
    },
  })
);

export default ActivateAccount;
