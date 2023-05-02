const mongoose = require('mongoose');
const User = require('../models/user');
const { ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND } = require('../http-status-codes');
const bcrypt = require('bcryptjs');

// получение всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

// получение пользователя по id
const getUserById = (req, res) => {
  const { userId } = req.params;

  // проверка на валидность ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Некорректный идентификатор пользователя' });
  }

  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
  return res;
};

// создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({ name, about, avatar, email, password: bcrypt.hashSync(password, 10) })
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

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
  return res;
};

// обновление аватара
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar,
};
