var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var ctrlBlogs = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');
var ctrlTicTac = require('../controllers/tictac');

//blogs
router.get('/blogs', ctrlBlogs.blogList);
router.post('/blogs', auth, ctrlBlogs.blogCreate);
router.get('/blogs/:blogid', ctrlBlogs.blogReadOne);
router.put('/blogs/:blogid', auth, ctrlBlogs.blogUpdateOne);
router.delete('/blogs/:blogid', auth, ctrlBlogs.blogDeleteOne);

//Users
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Tic Tac
router.get('/tictac', ctrlTicTac.ticTacList);
router.get('/tictac/:tictacid', ctrlTicTac.ticTacReadOne);
router.put('/tictac/:tictacid', auth, ctrlTicTac.ticTacUpdateOne);
router.post('/tictac', auth, ctrlTicTac.ticTacCreate);
router.delete('/tictac/:tictacid', auth, ctrlTicTac.ticTacDeleteOne);

module.exports = router;
