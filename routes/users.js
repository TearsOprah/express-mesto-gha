const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

// роут для получения всех пользователей
router.get('/', getUsers);

// роут для получения пользователя по _id
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(24).max(24),
  }),
}), getUserById);

// роут для получения информации о текущем пользователе
router.get('/me', getCurrentUser);

// роут для обновления профиля пользователя
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

// роут для обновления аватара пользователя
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), updateUserAvatar);

module.exports = router;
