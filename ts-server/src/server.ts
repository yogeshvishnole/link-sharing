import * as dotenv from 'dotenv';
import * as path from 'path';
import mongoose = require('mongoose');
import app from './app';

dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose
  .connect(
    `mmongodb+srv://dbuser:dbuser@cluster0.bttdj.mongodb.net/<dbname>?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('DB connected')).catch(err => console.log(err))

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
