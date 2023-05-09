module.exports = (err, _, res) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    const { statusCode = 400 } = err;
    return res.status(statusCode).send({ message: 'Переданы некорректные данные' });
  }

  if (err.code === 11000) {
    const { statusCode = 409 } = err;
    return res.status(statusCode).send({ message: 'Пользователь с таким электронным адресом уже зарегистрирован' });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  const { statusCode = 500 } = err;
  return res.status(statusCode).send({ message: 'На сервере произошла ошибка' });
};
