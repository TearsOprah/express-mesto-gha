const mongoose = require('mongoose');
const User = require('../models/user');
const { ERROR_CODE_INTERNAL_SERVER_ERROR, errorsHandler, ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND } = require('../http-status-codes');
const bcrypt = require('bcryptjs');
// const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const secretKey = 'secret_key_here';

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
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => errorsHandler(err, res));
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

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        {
          expiresIn: '7d',
        },
      );
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      res.status(401).send({ message: err.message });
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    // проверяем, есть ли пользователь с таким id
    if (!user) {
      return Promise.reject(new Error('Пользователь не найден.'));
    }

    // возвращаем пользователя, если он есть
    return res.status(200).send(user);
  }).catch((err) => {
    next(err);
  });
};

module.exports = {
  createUser, getUsers, getUserById, getCurrentUser, updateUserProfile, updateUserAvatar, login,
};
