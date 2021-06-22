const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const { forwardAuthenticated, ensureAuthenticated } = require('../controllers/auth');
const userController=require('../controllers/userController');

// Register new user
router.post('/signup',forwardAuthenticated,userController.create);

// Login to account
router.post('/login', (req, res, next) => {
  passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

//user Logout 
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

//router.get("/:resetLink", userController.);

//user forget your password 
router.post('/forget',forwardAuthenticated,userController.resetLinkGenarate);

//user password reset route
router.post('/reset',forwardAuthenticated,userController.resetPassUpdate);

//update the profile
router.post('/profile',ensureAuthenticated,userController.update);

//update the user password by user profile
router.post('/password',ensureAuthenticated,userController.updatepassword);

module.exports = router;
