const createError = require('http-errors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const storesRouter = require('./routes/stores');
const petStoresRouter = require('./routes/petShops');
const petsRouter = require('./routes/pet');
const itemsRouter = require('./routes/item');

dotenv.config({path: './config.env'})
const app = express();
//DATABASE CONNECTION
//Database connection string in atlas
const mongodb = process.env.DATABASE.replace('<password>',process.env.DB_PASSWORD)

//Connect mongoose with mongodb
mongoose.connect(mongodb,{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(()=>{
  console.log('Connected to DB');
  console.log(mongoose.connection.readyState)
})

//Rate limiter
const APILimit = rateLimit({
  max:100,
  windowMs: 60*60*1000,
  message:'Too many calls to the API'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet())
app.use(logger('dev'));
app.use(express.json());
app.use(sanitize());
app.use(xss());
app.use(hpp())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(APILimit)

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stores', storesRouter);
app.use('/petShops', petStoresRouter);
app.use('/pets', petsRouter);
app.use('/items', itemsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
