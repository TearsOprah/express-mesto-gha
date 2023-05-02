const mongoose = require('mongoose');
const User = require('../models/user');
const { ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_UNAUTHORIZED, ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND } = require('../http-status-codes');
const bcrypt = require('bcryptjs');
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

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

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(ERROR_CODE_UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
          }

          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

          res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: true,
          });

          res.send({ message: 'Авторизация прошла успешно' });
        })
        .catch((err) => {
          res.status(ERROR_CODE_UNAUTHORIZED).send({ message: err.message });
        });
    })
    .catch(() => {
      res.status(ERROR_CODE_UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
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
