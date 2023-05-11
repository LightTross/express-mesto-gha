const router = require('express').Router();

const { errors } = require('celebrate');

const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');

const { NotFoundError } = require('../errors/errors');

const {
  signInValidation,
  signUpValidation,
} = require('../middlewares/validations');

router.post('/signup', signUpValidation, createUser);
router.post('/signin', signInValidation, login);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

router.use(errors());

module.exports = { router };
