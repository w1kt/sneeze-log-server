import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import reflectionsRouter from './routes/Reflections';
import usersRouter from './routes/Users';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/api/v1/reflections', reflectionsRouter);
app.use('/api/v1/users', usersRouter);

export default app;
