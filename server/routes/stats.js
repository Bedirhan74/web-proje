const express = require('express');
const router = express.Router();
const { trackVisitor, getGraphData } = require('../controllers/statsController');

router.get('/', trackVisitor);

router.get('/graph-data', getGraphData); // Yeni grafik endpoint'i


module.exports = router;
