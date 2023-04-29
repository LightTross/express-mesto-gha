const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const auth = require('../middlewares/auth');
const {
  getUserByIdValidation,
  updateUserValidation,
  updateAvatarValidation,
} = require('../middlewares/validations');

router.get('/me', getCurrentUser);
router.get('/', auth, getUsers);
router.get('/:userId', getUserByIdValidation, getUserById);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
