import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';

import v1Router from './routes/APIv1';
import publicRouter from './routes/Public';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
var app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1', v1Router);
app.use('/loggable', publicRouter);

// Catch-all handler
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }
  res.status(500);
  res.send('500: Internal server error');
});
export default app;
