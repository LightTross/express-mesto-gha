const User = require('../models/user');
const { BadRequest, NotFoundError, InternalServerError } = require('../errors/errors');

// создаем пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// возвращаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' }));
};

// возвращаем пользователя по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// обновляем профиль
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

// обновляем аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(InternalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};
