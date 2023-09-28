const express = require('express');
const router = express.Router();
const configRouter = require('../controllers/config');

router.get('/setup', configRouter.checkAppSetup);
router
  .route('/admin')
  .get(configRouter.checkAdminPresence)
  .post(configRouter.createAdmin);

router.route('/imageOrder').post(configRouter.createImageOrder);

module.exports = router;
