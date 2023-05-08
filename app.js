const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFound');
const errorHandler = require('./errors/errorHandler');
const rootRouter = require('./routes/index');

const { PORT = 3000 } = process.env;

// подключение к базе данных
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', rootRouter);

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
