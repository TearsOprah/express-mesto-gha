const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { urlRegExp } = require('../urlRegExp');

// роут для получения всех карточек
router.get('/', getAllCards);

// роут для создания новой карточки
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(urlRegExp),
  }),
}), createCard);

// роут для удаления карточки
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(24).max(24),
  }),
}), deleteCard);

// ставим лайк
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(24).max(24),
  }),
}), likeCard);

// удаляем лайк
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(24).max(24),
  }),
}), dislikeCard);

module.exports = router;
