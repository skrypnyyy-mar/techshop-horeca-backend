const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate'); // Keeping existing auth middleware for now
const { registerSchema, loginSchema } = require('../validators/auth.validators');

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.get('/me', authenticate, ctrl.me);

module.exports = router;
