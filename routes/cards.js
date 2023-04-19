const router = require('express').Router();
const { getAllCards, createCard, deleteCard } = require('../controllers/cards');

// роут для получения всех карточек
router.get('/cards', getAllCards);

// роут для создания новой карточки
router.post('/cards', createCard);

// роут для удаления карточки
router.delete('/cards/:cardId', deleteCard);

module.exports = router;