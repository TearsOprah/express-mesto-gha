const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

// подключение к базе данных
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роуты, которые не требуют авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi
      .string()
      .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), createUser);

// авторизация
app.use(auth);

// роуты, которым нужна авторизация
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors());

app.use((err, _, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    const { statusCode = 400 } = err;

    return res.status(statusCode).send({ message: 'Переданы некорректные данные' });
  }

  if (err.name === 'Error') return res.status(err.statusCode).send({ message: err.message });

  if (err.code === 11000) {
    const { statusCode = 409 } = err;

    return res.status(statusCode).send({ message: 'Пользователь с таким электронным адресом уже зарегистрирован' });
  }

  const { statusCode = 500 } = err;
  return next(res.status(statusCode).send({ message: 'На сервере произошла ошибка' }));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
