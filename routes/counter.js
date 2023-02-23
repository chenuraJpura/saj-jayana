const express=require('express');
const router =express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../controllers/auth');
const countController=require('../controllers/countController');

//counter page display for users
router.get('/', ensureAuthenticated,(req,res)=> {
    res.render('counter', {user:req.user});
});

// create new counter
router.post('/create',ensureAuthenticated,countController.create);

// delete counter
router.post('/delete',ensureAuthenticated,countController.delete);


module.exports=router;