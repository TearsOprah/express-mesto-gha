const Card = require('../models/card');

// контроллер получения всех карточек
const getAllCards = (req, res) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
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
      res.status(500).json({ message: err.message });
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
      res.status(200).json({ card });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// ставим лайк
const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true }) // добавить _id в массив, если его там нет
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = { getAllCards, createCard, deleteCard, likeCard };