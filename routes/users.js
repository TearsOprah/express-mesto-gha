const router = require('express').Router();
const { createUser, getUsers, getUserById, updateUserProfile } = require('../controllers/users');

// роут для получения всех пользователей
router.get('/users', getUsers);

// роут для получения пользователя по _id
router.get('/users/:userId', getUserById);

// роут для создания нового пользователя
router.post('/users', createUser);

// обновление профиля пользователя
router.patch('/users/me', updateUserProfile);

module.exports = router;
