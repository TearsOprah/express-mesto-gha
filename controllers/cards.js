const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  STATUS_CREATED,
} = require('../http-status-codes');

const NotFoundError = require('../errors/NotFound');
const AccessDeniedError = require('../errors/AccessDenied');

// контроллер получения всех карточек
function getAllCards(req, res, next) {
  Card.find()
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

// контроллер для создания новой карточки
function createCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch(next);
}

// контроллер удаления карточки
function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  // проверка на валидность ObjectId
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    res.status(400).json({ message: 'Некорректный идентификатор карточки' });
  }

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }

      // проверяем, что пользователь имеет право удалять карточку
      if (card.owner.toString() !== userId) {
        throw new AccessDeniedError('Нет прав доступа');
      }

      Card.findByIdAndRemove(cardId);
    })
    .then((card) => {
      res.json({ card });
    })
    .catch(next);
}

// ставим лайк
function likeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .catch(next);
}

// удаление лайка
function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .catch(next);
}

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
