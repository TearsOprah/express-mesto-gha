const User = require('../models/user');

const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500;

// получение всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

// получение пользователя по id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

// создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновление данных профиля
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  // Проверка на длину полей name и about
  if (name.length < 2 || name.length > 30 || about.length < 2 || about.length > 30) {
    return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Длина полей name и about должна быть от 2 до 30 символов' });
  }

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send({ message: 'Данные профиля успешно обновлены' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновление аватара
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar,
};
