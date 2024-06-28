const express = require('express');
const { createUser, logIn, allUsers } = require('../controller/userController');
const router = express.Router();

router.post('/sign-up', createUser);

router.get('/sign-in', logIn);

router.get('/all', allUsers);

module.exports = router