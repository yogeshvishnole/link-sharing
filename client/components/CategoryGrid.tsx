import { Grid } from "@material-ui/core";
import Link from "next/link";

import { Category } from "types";
import CategoryCard from "./CategoryCard";

interface Props {
  categories: (Category & { slug: string })[];
}

const CategoryGrid: React.FC<Props> = ({ categories }) => {
  return (
    <Grid container spacing={3}>
      {categories.map((category) => {
        return (
          <Link href={`/links/${category.slug}`}>
            <Grid key={category.name} item xs={4}>
              <CategoryCard category={category} />
            </Grid>
          </Link>
        );
      })}
    </Grid>
  );
};

export default CategoryGrid;
