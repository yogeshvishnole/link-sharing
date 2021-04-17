import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import BusinessError from './exceptions/business-error';
import globalErrorHandler from './exceptions/global-error-handler';
import router from '../src/routes/';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '5mb', type: 'application/json' }));

// route middlewares
app.use('/api/v1', router);

app.all('*', (req, res, next) => {
  next(new BusinessError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
export default app;
