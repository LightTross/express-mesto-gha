const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const getBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || (!authorization.startsWith('Bearer '))) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  // извлекаем токен
  const token = getBearerToken(authorization);

  let payload;

  try {
    // пытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;

  // пропускаем запрос дальше
  return next();
};
