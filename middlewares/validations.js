const { celebrate, Joi } = require('celebrate');

// валидация аутентификации
const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(24),
  }),
});

// валидация регистрации
const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(24),
    name: Joi.string(),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(ftp|http|https):\/\/[^ "]+$/).message('Неверный url адрес'),
  }),
});

// валидация ID пользователя
const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

// валидация обновления профиля
const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

// валидация обновления аватара
const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(ftp|http|https):\/\/[^ "]+$/).message('Неверный url адрес'),
  }),
});

// валидация создания карточки
const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().regex(/^(ftp|http|https):\/\/[^ "]+$/).message('Неверный url адрес').required(),
  }),
});

// валидация ID карточки
const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  getUserByIdValidation,
  updateUserValidation,
  updateAvatarValidation,
  createCardValidation,
  cardIdValidation,
};
