const express = require('express');
const router = express.Router();
const userController=require('../controllers/userController');
const { ensureAuthenticated, forwardAuthenticated } = require('../controllers/auth');
const taskController=require('../controllers/taskController');

// Welcome Page
router.get('/',forwardAuthenticated, (req, res) => res.render('welcome'));

//Public Counter 
router.get('/counter',forwardAuthenticated,(req,res)=>res.render('publiccounter'));

// Login Page
router.get('/login',forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/signup',forwardAuthenticated, (req, res) => res.render('signup'));

// home page 
router.get('/home', ensureAuthenticated,taskController.view);

// profile page 
router.get('/profile', ensureAuthenticated,(req,res)=> {res.render('profile', {user:req.user});});

//user forget your password display
router.get('/forget',(req,res)=>{ res.render('forget');});

//forget user
router.get('/reset/:token',forwardAuthenticated,userController.resetLinkValidater);

module.exports = router;