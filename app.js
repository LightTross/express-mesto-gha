const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { NotFoundError } = require('./errors/errors');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const {
  signInValidation,
  signUpValidation,
} = require('./middlewares/validations');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', signInValidation, login);
app.post('/signup', signUpValidation, createUser);

app.use(auth);

app.use('/auth/users', require('./routes/users'));
app.use('/auth/cards', require('./routes/cards'));

app.use(errors());

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Внутренняя ошибка сервера' : message,
  });

  next();
});

app.use('*', (req, res) => {
  res.status(NotFoundError).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
