import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

/**
 * Creating connection to mongo atlas
 */
const DB_STRING = `mongodb+srv://dbuser:${process.env.DATABASE_PASSWORD}@cluster0.bttdj.mongodb.net/<dbname>?retryWrites=true&w=majority`;

mongoose
  .connect(DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('DB connected'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
