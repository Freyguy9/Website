var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home.js');
var ctrlList = require('../controllers/blog.js');
var editEntry = require('../controllers/blog.js');
var deleteEntry = require('../controllers/blog.js');

/* Setup routes to pages. */
router.get('/', ctrlHome.home);
router.get('/list',ctrlList.list);
router.get('/add',ctrlList.add);
router.get('/edit',editEntry.edit);
router.get('/remove',deleteEntry.remove);

module.exports = router;
