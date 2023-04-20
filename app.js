const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

// подключение к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '643fbfc42a3165704f7c4a34', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(express.json());
app.use(usersRouter);
app.use(cardsRouter);

// middleware для обработки неправильного пути
const handleNotFound = (req, res, next) => {
  const error = new Error('Был запрошен несуществующий роут');
  error.status = 404;
  next(error);
};

// обработка ошибки 404
app.use(handleNotFound);

// middleware обработки ошибок
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
