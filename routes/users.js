const router = require('express').Router();
// const auth = require('../middlewares/auth');
const {
  getCurrentUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  createUser,
  login,
} = require('../controllers/users');

// роут для получения всех пользователей
router.get('/users', getUsers);

// роут для получения пользователя по _id
router.get('/users/:userId', getUserById);

// // роут для создания нового пользователя
// router.post('/signup', createUser);
//
// // роут для логина
// router.post('/signin', login);

// роут для получения информации о текущем пользователе
router.get('/users/me', getCurrentUser);

// роут для обновления профиля пользователя
router.patch('/users/me', updateUserProfile);

// роут для обновления аватара пользователя
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
