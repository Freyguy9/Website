var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlList = require('../controllers/blog.js');

/* Setup routes to pages. */
router.get('/', ctrlHome.home);
router.get('/list',ctrlList.list);
router.get('/add',ctrlList.add);

module.exports = router;
