const Card = require('../models/card');
const { BadRequest, NotFoundError, InternalServerError } = require('../errors/errors');

// создаем карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// получаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' }));
};

// удаляем карточку
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findOneAndDelete({ _id: cardId })
    .then((card) => {
      if (!card) {
        return res.status(NotFoundError).send({ message: 'Карточка c указанным ID не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      return res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// проставляем лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// удяляем лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};
