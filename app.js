const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb')

app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
