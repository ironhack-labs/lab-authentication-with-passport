const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.mid');
const users = require('../controllers/user.controller');

router.get('/', secure.isAuthenticated, users.list);
router.post('/:id/delete', secure.isAuthenticated, secure.checkRole('admin'), users.delete);

module.exports = router;