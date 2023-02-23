const countModel=require('../models/countTaskModel');
const User=require('../models/UserModel');

//create count function
exports.create=async (req,res)=> {
    try {
    
        let { title,count,ob_id } = req.body;
        //checking is this user object id is exist or not  
        ob_id=ob_id.trim();

        const user=await User.findOne({_id:ob_id});

        if(!user){
            req.flash('error_msg', 'ERROR: '+`Log Again`);
            res.redirect('/login');
        }

        const countObj = new countModel({ title,count,ob_id});
        await countObj.save();
 
        req.flash('success_msg','count saved');
        res.redirect('/home'); 
    
    }catch(error){
    
        req.flash('error_msg',error.toString());
        res.redirect('/home');
    
    }
}

//delete task function
exports.delete = async (req, res) => {
    try {
      const { count_id } = req.body;
  
      const deletedCount = await countModel.findByIdAndRemove(count_id);
    
      if (!deletedCount) {
        req.flash('error_msg', 'ERROR: '+"Delete Fail");
        res.redirect('/home');
      }else{
        req.flash('success_msg','Count deleted');
        res.redirect('/home');    
      }
  
    } catch (error) {
      req.flash('error_msg', 'ERROR: '+error);
      res.redirect('/home');
  }
  };