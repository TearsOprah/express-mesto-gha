const User = require('../models/user');

// получение всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// получение пользователя по id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// обновление данных профиля
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' })
      }
      return res.send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// обновление аватара
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' })
      }
      return res.send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = { createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar };
