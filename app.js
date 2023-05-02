const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { ERROR_CODE_NOT_FOUND } = require('./http-status-codes');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const app = express();
const { PORT = 3000 } = process.env;

// подключение к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(usersRouter);
app.use(cardsRouter);

app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

// роуты, которым нужна авторизация
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Страница не найдена' }));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
