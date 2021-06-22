const express=require('express');
const router =express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../controllers/auth');
const taskController=require('../controllers/taskController');

// create new task
router.post('/create',ensureAuthenticated,taskController.create);

//update task
router.post('/update',ensureAuthenticated,taskController.update);

//update task state
router.post('/state',ensureAuthenticated,taskController.state);

//delete task
router.post('/delete',ensureAuthenticated,taskController.delete);


module.exports=router;