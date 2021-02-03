import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// route middlewares
app.use('/api/v1/auth', authRoutes);

export default app;
