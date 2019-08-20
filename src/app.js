import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import v1Router from './routes/APIv1';

var app = express();

app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1', v1Router);

// Catch-all handler
app.use((err, req, res, next) => {
  if (!err) {
      return next();
  }
  res.status(500);
  res.send('500: Internal server error');
});
export default app;
