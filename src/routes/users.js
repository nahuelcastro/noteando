const express = require('express');
const router = express.Router();

router.get('/users/signin', (req, res) => {
    res.send('Sign in')
});

router.get('/users/signup', (req, res) => {
    res.send('Sign up')
});

module.exports = router;