const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');

const app = express();
const { PORT = 3000 } = process.env;

// подключение к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(express.json())
app.use(usersRouter);

app.use('/users', require('./routes/users'))

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
