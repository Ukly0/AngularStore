const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/update', emailController.sendupdate);

module.exports = router;