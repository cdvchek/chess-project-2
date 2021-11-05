// WSK Built Routes
const express = require('express');
const router = express.Router();
const frontEndRoutes = require('./frontEndRoutes');
router.use('/', frontEndRoutes);
module.exports = router;