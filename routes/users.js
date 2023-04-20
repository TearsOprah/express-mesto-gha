const router = require('express').Router();
const {
  createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

// роут для получения всех пользователей
router.get('/users', getUsers);

// роут для получения пользователя по _id
router.get('/users/:userId', getUserById);

// роут для создания нового пользователя
router.post('/users', createUser);

// обновление профиля пользователя
router.patch('/users/me', updateUserProfile);

// обновление аватара
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
