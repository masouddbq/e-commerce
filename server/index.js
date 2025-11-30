/* eslint-env node */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { otpRouter } from './routes/otp.js';
import { paymentRouter } from './routes/payment.js';
import process from 'node:process';

dotenv.config();

const app = express();

const {
  PORT = 4000,
  NODE_ENV,
  CLIENT_ORIGIN,
} = process.env;

const corsOrigins = CLIENT_ORIGIN
  ? CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json());

if (NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/otp', otpRouter);
app.use('/api/payment', paymentRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'خطای داخلی سرور',
  });
});

app.listen(PORT, () => {
  console.log(`OTP server listening on port ${PORT}`);
});


