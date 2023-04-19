const router = require('express').Router();
const { createUser, getUsers, getUserById } = require('../controllers/users');

// роут для получения всех пользователей
router.get('/users', getUsers);

// роут для получения пользователя по _id
router.get('/users/:userId', getUserById);

// роут для создания нового пользователя
router.post('/users', createUser);

module.exports = router;
