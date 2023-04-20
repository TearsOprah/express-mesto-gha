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

// обработка несуществующих маршрутов
app.use((req, res) => res.status(404).json({ message: 'Запрашиваемый ресурс не найден' }));

app.use(express.json());
app.use(usersRouter);
app.use(cardsRouter);

app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
