const express = require('express');
const router = express.Router();
const configRouter = require('../controllers/config');

router.get('/setup', configRouter.checkAppSetup);
router.get('/admin', configRouter.checkAdminPresence);

module.exports = router;
