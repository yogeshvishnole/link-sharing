import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import { pipeProps } from "next-pipe-props";
import { Grid, Box, Typography, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withUser, roleAdmin } from "../../../utils/pipeFunctions";
import Layout from "../../../components/layout";
import { GetServerSideProps } from "next";
import Link from "next/link";

const ReadCategoryAdmin = ({ token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    categories: [],
  });
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`/api/v1/categories`);
    setState({ ...state, categories: response.data.data.categories });
  };

  const deleteCategory = (id) => {
    handleClickOpen(id);
  };

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    handleClose();

    try {
      const response = await axios.delete(`/api/v1/categories/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteId("");
      loadCategories();
    } catch (err) {
      console.log("Category deleted error : ", err);
    }
  };

  const deleteConfirmationDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete this category ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This category will be deleted
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            NO
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const { categories } = state;

  return (
    <Layout>
      <Typography variant="h4" style={{ marginBottom: "1rem" }}>
        List of categories
      </Typography>

      {categories.map((category) => {
        return (
          <Grid container spacing={5}>
            <Grid item xs={8}>
              <Link href={`/links/${category.slug}`}>
                <div className="category-card">
                  <div className="category-card__img">
                    <img src={category.image.url} alt={category.name} />
                  </div>
                  <p className="flex-center category-card__p">
                    {category.name}
                  </p>
                </div>
              </Link>
            </Grid>

            <Grid
              container
              item
              xs={4}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Link href={`/admin/category/${category.slug}`}>
                <Button
                  color="primary"
                  variant="outlined"
                  style={{ marginBottom: "1rem" }}
                >
                  UPDATE
                </Button>
              </Link>

              <Button
                color="secondary"
                variant="outlined"
                onClick={(e) => deleteCategory(category.slug)}
              >
                DELETE
              </Button>
            </Grid>
          </Grid>
        );
      })}

      {deleteConfirmationDialog()}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = pipeProps(
  withUser,
  roleAdmin
);

export default ReadCategoryAdmin;
