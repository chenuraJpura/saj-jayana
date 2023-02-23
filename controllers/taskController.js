const Task=require('../models/TaskModel');
const User=require('../models/UserModel');
const httpStatus=require('http-status');
const countModel=require('../models/countTaskModel');

//create task function
exports.create=async (req,res)=> {
    try {
        const { title,state,point,ob_id } = req.body;
        //checking is this user object id is exist or not  
        User.findOne({
          _id:ob_id
        }).then(user => {
          if (!user) {
            req.flash('error_msg', 'ERROR: '+httpStatus.UNPROCESSABLE_ENTITY+`Login Again`);
            res.redirect('/login');
          }
        });
      const task = new Task({ title,state,point,ob_id});
        await task.save();
        req.flash('success_msg','task created successfully');
        res.redirect('/home'); 
      } catch (error) {
        //next(error);
        req.flash('error_msg',error.toString());
        res.redirect('/home');
      }
}

//update task state function
exports.state = async (req, res) => {
  try {
    const { task_id,state } = req.body;
   
    if(!(state=="todo" || state=="done")){
      req.flash('error_msg', 'ERROR: '+"Something Wrong");
      res.redirect('/home');
    }

    if(state=="todo"){
      //todo-->done
      const task = await Task.findOneAndUpdate({_id:task_id}, {$set: {state:"done"}});

      if (!task) {
          req.flash('error_msg', 'ERROR: '+"Something Wrong");
          res.redirect('/home');
      }else{
          req.flash('success_msg','Updated');
          res.redirect('/home');
      }

    }else{
      //done to todo
      const task = await Task.findOneAndUpdate({_id:task_id}, {$set: {state:"todo"}});

      if (!task) {
          req.flash('error_msg', 'ERROR: '+"Something Wrong");
          res.redirect('/home');
      }else{
          req.flash('success_msg','Updated');
          res.redirect('/home');
      }


    }
  } catch (error) {
      req.flash('error_msg', 'ERROR: '+error);
      res.redirect('/home');
  }
};

//update task function
exports.update = async (req, res) => {
  try {
    const { task_id,task_title } = req.body;
   
    const task = await Task.findOneAndUpdate({_id:task_id}, {$set: {title:task_title}});

    if (!task) {
        req.flash('error_msg', 'ERROR: '+"Update unsuccessfully");
        res.redirect('/home');
    }else{
      req.flash('success_msg','task updated successfully');
      res.redirect('/home');
    }

    
  } catch (error) {
      req.flash('error_msg', 'ERROR: '+error);
      res.redirect('/home');
  }
};

//delete task function
exports.delete = async (req, res) => {
  try {
    const { task_id } = req.body;

    const deletedTask = await Task.findByIdAndRemove(task_id);
  
    if (!deletedTask) {
      req.flash('error_msg', 'ERROR: '+"Delete Fail");
      res.redirect('/home');
    }else{
      req.flash('success_msg','task deleted');
      res.redirect('/home');    
    }

  } catch (error) {
    req.flash('error_msg', 'ERROR: '+error);
    res.redirect('/home');
}
};


//view task function
exports.view=async (req,res)=>{

  const task=await Task.find({ob_id:req.user._id}).sort({ createdAt: -1 });

  //view count section

  const countObj=await countModel.find({ob_id:req.user._id}).sort({ createdAt: -1 });

  if(task && countObj){
      res.render('home', {user:req.user,
                          taskList : task,
                          countList:countObj});
  }else if(task){
     console.log(2);
      res.render('home', {user:req.user,
                          taskList : task});
  }else if(countObj){
     console.log(3);  
      res.render('home', {user:req.user,
                          countList:countObj});
  }else{
     console.log(4);
      res.render('home', {user:req.user});
  }
  
};