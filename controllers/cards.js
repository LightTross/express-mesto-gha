const Card = require('../models/card');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors/errors');

// создаем карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// получаем все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  const deleteCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card))
      .catch(next);
  };

  Card.findById(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка c указанным ID не найдена'));
      }

      const userId = req.user._id.toString();
      const cardUserId = card.owner._id.toString();

      if (userId !== cardUserId) {
        return next(new ForbiddenError('Недостаточно прав для удаления'));
      }

      return deleteCard();
    })
    .catch(next);
};

// проставляем лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена: невозможно поставить лайк'));
      }
      return res.status(200).send(card);
    })
    .catch(next);
};

// удяляем лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена: невозможно убрать лайк'));
      }
      return res.status(200).send(card);
    })
    .catch(next);
};
