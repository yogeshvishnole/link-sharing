import 'dotenv/config';
import initDB from './db';
import app from './app';

initDB();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
