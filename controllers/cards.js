const Card = require('../models/card');

// контроллер получения всех карточек
const getAllCards = (req, res) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

// контроллер для создания новой карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).json({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).json({ message: 'Ошибка по умолчанию' });
    });
};

// контроллер удаления карточки
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).json({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(200).json({ card });
    })
    .catch(() => res.status(500).json({ message: 'Ошибка по умолчанию' }));
};

// ставим лайк
const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// удаление лайка
const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
