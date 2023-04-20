const Card = require('../models/card');

// контроллер получения всех карточек
const getAllCards = (req, res) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
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
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).json({ message: 'Ошибка сервера' });
    });
};

// контроллер удаления карточки
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).json({ message: 'Карточка не найдена' });
      }
      return res.status(200).json({ card });
    })
    .catch(() => res.status(500).json({ message: 'Ошибка сервера' }));
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
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
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
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
