const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('all_appeal', { title: 'system-for-handling-requests' });
});

module.exports = router;
