import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import Resizer from "react-image-file-resizer";
import { pipeProps } from "next-pipe-props";
import { GetServerSideProps } from "next";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import { Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.bubble.css";

import { withUser, roleAdmin, getCategory } from "../../../utils/pipeFunctions";
import FormikField from "../../../components/formik-field";
import Layout from "../../../components/layout";

interface FormValueTypes {
  name: string;
  image: string | null;
  content: string;
}

const categorySchema = yup.object().shape({
  name: yup.string().required("Required"),
  image: yup.string().nullable().required("Required"),
});

const UpdateCategory = ({ token, category: oldCategory }) => {
  const initialFormValues: FormValueTypes = {
    name: oldCategory.name,
    image: null,
    content: oldCategory.content,
  };

  const [btnText, setBtnText] = useState("Update");
  const [imageUploadText, setImageUploadText] = useState<string>(
    "Update Image"
  );
  const [content, setContent] = useState(oldCategory.content);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(oldCategory.image.url);

  const handleContent = (e) => {
    setContent(e);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success || error) {
        setSuccess("");
        setError("");
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleSubmit = async (values: FormValueTypes, { setFieldValue }) => {
    setBtnText("Updating...");
    // const formData = process.browser && new FormData();
    // for (const [key, value] of Object.entries(values)) {
    //   formData.set(key, value);
    // }
    values.content = content;

    try {
      const response = await axios.patch(
        `/api/v1/categories/${oldCategory.slug}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImageUploadText("Update Image");
      setBtnText("Update");
      setSuccess(`Category ${response.data.data.category.name} is created`);
      setFieldValue("name", response.data.data.category.name);
      setContent(response.data.data.category.content);
      setImagePreview(response.data.data.category.image.url);
    } catch (err) {
      setError(err.response.data.message);
      setBtnText("Update");
    }
  };
  return (
    <Layout>
      <Grid container justify="center" alignItems="center">
        <Box className="formBox">
          <Typography component="h1" variant="h4">
            Update Category
          </Typography>
          {success && <Alert severity="success"> {success}</Alert>}
          {error && <Alert severity="error"> {error}</Alert>}
          <Formik
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            validationSchema={categorySchema}
          >
            {({ setFieldValue }) => (
              <Form>
                <Grid item>
                  <FormikField name="name" label="Name" />
                </Grid>
                <Grid item style={{ marginBottom: "10px" }}>
                  <Typography>Content</Typography>
                  <ReactQuill
                    value={content}
                    theme="bubble"
                    onChange={handleContent}
                    placeholder="Write something...."
                    style={{
                      border: "1.5px solid #e1e1e1",
                      borderRadius: "4px",
                      minHeight: "4rem",
                    }}
                  />
                </Grid>
                <Grid container item spacing={5}>
                  <Grid item>
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        color="secondary"
                        component="span"
                      >
                        {imageUploadText}
                      </Button>
                    </label>
                  </Grid>
                  <Grid item>
                    <span>
                      <img
                        src={imagePreview}
                        alt="category"
                        style={{ height: "100px", width: "100px" }}
                      />
                    </span>
                  </Grid>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="contained-button-file"
                    onChange={(event) => {
                      let fileInput = false;
                      if (event.target.files[0]) {
                        setImageUploadText(event.target.files[0].name);
                        fileInput = true;
                      }
                      if (fileInput) {
                        try {
                          Resizer.imageFileResizer(
                            event.target.files[0],
                            300,
                            300,
                            "JPEG",
                            100,
                            0,
                            (uri) => {
                              setFieldValue("image", uri);
                            },
                            "base64",
                            200,
                            200
                          );
                        } catch (err) {
                          console.log(err);
                        }
                      }
                    }}
                    type="file"
                  />
                  <ErrorMessage name="image" />
                </Grid>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginTop: "1rem" }}
                >
                  {btnText}
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
  roleAdmin,
  getCategory
);

export default UpdateCategory;
