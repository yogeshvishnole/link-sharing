import { Card, CardMedia } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import clsx from "clsx";
import { Category } from "types";

interface Props {
  category: Category;
}

const CategoryCard: React.FC<Props> = ({ category: { name, image } }) => {
  const classes = useStyles();
  return (
    <div className="category-card">
      <p className="flex-center category-card__p">{name}</p>
      <div className="category-card__img">
        <img src={image.url} alt={name} />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      border: "2px solid red",
    },
    cover: {
      display: "block",
      width: "100%",
      maxWidth: "100%",
    },
    nameBox: {
      padding: 40,
      width: "30%",
      backgroundColor: "lightblue",
    },
  })
);

export default CategoryCard;
