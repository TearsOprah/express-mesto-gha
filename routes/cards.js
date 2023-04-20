const router = require('express').Router();
const { getAllCards, createCard, deleteCard, likeCard } = require('../controllers/cards');

// роут для получения всех карточек
router.get('/cards', getAllCards);

// роут для создания новой карточки
router.post('/cards', createCard);

// роут для удаления карточки
router.delete('/cards/:cardId', deleteCard);

// ставим лайк
router.put('/cards/:cardId/likes', likeCard);

module.exports = router;