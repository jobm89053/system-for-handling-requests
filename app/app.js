const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const all_appealRouter = require('./routes/all_appeal');
const create_appealRouter = require('./routes/create_appeal');
const appeal_detailRouter = require('./routes/appeal_detail');
const appeal_solutionRouter = require('./routes/appeal_solution');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', all_appealRouter);
app.use('/all_appeal', all_appealRouter);
app.use('/create_appeal', create_appealRouter);
app.use('/appeal_detail', appeal_detailRouter);
app.use('/appeal_solution', appeal_solutionRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
