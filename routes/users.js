const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createUser,
  getCurrentUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  login,
} = require('../controllers/users');

// роут для получения всех пользователей
router.get('/users', auth, getUsers);

// роут для получения пользователя по _id
router.get('/users/:userId', auth, getUserById);

// роут для создания нового пользователя
router.post('/signup', createUser);

// роут для логина
router.post('/signin', login);

// роут для получения информации о текущем пользователе
router.get('/users/me', auth, getCurrentUser);

// роут для обновления профиля пользователя
router.patch('/users/me', auth, updateUserProfile);

// роут для обновления аватара пользователя
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
