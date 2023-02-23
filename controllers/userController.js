const bcrypt = require('bcryptjs');
const User=require('../models/UserModel');
const ResetToken=require('../models/ResetTokenModel');
const crypto=require('crypto');
const sgMail = require('@sendgrid/mail');
const config=require('../conifg');

//email sending section
function resetEmailSender(token,req) {
  sgMail.setApiKey(config.SENDGRID_API_KEY);
    const msg = {
          to: req.body.email, // Change to your recipient
          from: 'as95610@sci.sjp.ac.lk', // Change to your verified sender
          subject: 'Saj Jayana App Password Reset Link',
          html: '<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.<br>'+
                'Please click on the following link, or paste this into your browser to complete the process:<br>' +
                'http://' + req.headers.host + '/reset/' + token + '<br>' +
          'If you did not request this, please ignore this email and your password will remain unchanged</p>',
}
sgMail.send(msg).then(() => {
        console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })


}
//token Genarator
function tokenGenarator() {
  return crypto.randomBytes(20).toString('hex');
}
//creating the user
exports.create=async (req, res) => {
    let { name, email, password } = req.body;
        name=name.trim();
        email=email.trim();
        password=password.trim();
        let errors = [];
        if (!name || !email || !password ) {
            errors.push({ msg: 'Please enter all fields' });
        }
        if (password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters' });
        }
        if (errors.length > 0) {
            res.render('signup', {errors,name,email,password});
        } else {
          await User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('signup', {errors,name,email,password});
            }else{
                const newUser = new User({name,email,password});
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                                                      if (err) throw err;
                                                  newUser.password = hash;
                                            newUser.save().then(user => {
                                                      req.flash('success_msg','You are now registered and can log in');
                                                      res.redirect('/login');})
                                                      .catch(err => console.log(err));
            });
          });
        }
      });
    }
  }
 //update the user  
exports.update=async (req, res) => {
    try {
        const { user_id,user_old_email,user_email,user_name } = req.body;

        if(new String(user_old_email).valueOf() == new String(user_email).valueOf()){
          //updating the name section only
          const userUpdate = await User.findOneAndUpdate({_id:user_id}, {$set: {name:user_name}});

          if (!userUpdate) {
              req.flash('error_msg', 'ERROR: '+"Update unsuccessfully");
              res.redirect('/profile');
          }else{
              req.flash('success_msg','updated successfully');
              res.redirect('/profile');
              }
  

        }else{

                  //if new email exist in db update process will be denied
        const existOfEmail=await User.findOne({ email: user_email });
        if(existOfEmail){
          req.flash('error_msg', 'ERROR: '+"Email Already in the system");
          res.redirect('/profile');
        }else{
          const userUpdate = await User.findOneAndUpdate({_id:user_id}, {$set: {email:user_email,name:user_name}});

        if (!userUpdate) {
            req.flash('error_msg', 'ERROR: '+"Update unsuccessfully");
            res.redirect('/profile');
        }else{
            req.flash('success_msg','updated successfully');
            res.redirect('/profile');
            }

        }

        }


    } catch (error) {
            req.flash('error_msg', 'ERROR: '+error);
            res.redirect('/profile');
    }
}
//update the user password by logged user
exports.updatepassword=async (req, res) => {
  try {
      const { user_id,old_pass,new_pass} = req.body;

      //validating the data

      if(user_id || old_pass || new_pass){
        //checking the old password

        const user =await User.findOne({_id: user_id});

        // Match password
        bcrypt.compare(old_pass, user.password, (err, isMatch) => {
        if (err) throw err;
        //old pass matched
        if (isMatch) {
        
          //hashing new password

           bcrypt.genSalt(10,async (err, salt) => {
             bcrypt.hash(new_pass, salt,async (err, hash) => {
                if (err) throw err;
                
                const userUpdate = await User.findOneAndUpdate({_id:user_id}, {$set: {password:hash}});

                if (!userUpdate) {
                      req.flash('error_msg', 'ERROR: '+"Update unsuccessfully");
                      res.redirect('/profile');
                }else{
                      req.flash('success_msg','updated successfully');
                      res.redirect('/profile');
                }
                                              
                                              
            });
          });



          
        } else {

                  req.flash('error_msg',"Old Password Wrong");
                  res.redirect('/profile');
                    
                  }
        });

        
      }else{

        req.flash('success_msg','some fields are empty');
        res.redirect('/profile');
  
      }



  }catch(error) {
          req.flash('error_msg', 'ERROR: '+error);
          res.redirect('/profile');
  }
}
//reset the user password
exports.resetLinkGenarate=async (req, res) => {
  try {
    userEmail=req.body.email;
    userEmail=userEmail.trim();
    const user=await User.findOne({ email: userEmail });
    if(!user) {
      req.flash('error_msg', 'No account with that email address exists.');
      return res.redirect('/forget');
    }
    //token genrater
    let token=tokenGenarator();
    const ResetTokenTime =new Date(Date.now()+3600000);
    //if reset never requested create a new one
    await ResetToken.findOne({
      email:userEmail
    }).then(resetObj => {
      if (!resetObj) {
            const newResetObj=new ResetToken({resetPasswordToken:token,
                                                       email:userEmail,
                                   resetPasswordExpires:ResetTokenTime});        
            newResetObj.save();
            //sending the verfication email
            resetEmailSender(token,req);
            req.flash('success_msg','Email Sended!');
            res.redirect('/forget');
      }else{
        //update object was created earlier
        ResetToken.findOneAndUpdate({email:userEmail},
          {$set: {resetPasswordToken:token,
                  resetPasswordExpires:ResetTokenTime}}).then(updateObj=>{
                if (updateObj) {
                  req.flash('success_msg','Email Sended!');
                  resetEmailSender(token,req);
                  res.redirect('/forget');
                }  
                                                    });
      }
    });
  } catch (error) {
    req.flash('error_msg', 'ERROR: '+"something wrong!"+`${error}`);
    res.redirect('/forget');
  }
    
}

//validating reset link
exports.resetLinkValidater=async (req, res)=> {
    ResetToken.findOne({ resetPasswordToken: req.params.token,resetPasswordExpires: { $gt: Date.now() }}).then(resetLinkObj=>{
          if (!resetLinkObj) {
                  req.flash('error_msg','Password reset token is invalid or has expired.');
                  return res.redirect('/forget');
                  }res.render('reset',{resetToken:req.params.token});
  });
}
//updating the rested password
exports.resetPassUpdate=async (req,res)=>{
 try {
      const { reset_token,new_password,new_password_conformation} = req.body;

      let errors = [];
      if (!reset_token || !new_password || !new_password_conformation ) {
              errors.push({ msg: 'Please enter all fields' });
      }
      if (!(new String(new_password).valueOf() == new String(new_password_conformation).valueOf())) {
              errors.push({ msg: 'Passwords are not match' });
      }if (errors.length > 0) {
            res.render('login', {errors});
    }else{

      ResetToken.findOne({ resetPasswordToken:`${reset_token.trim()}`}).then(resetLinkObj=>{
      
        if(!resetLinkObj){
          req.flash('error_msg', 'ERROR: '+"Reset Error"+`${error}`);
          res.redirect('/forget');
        }else{
          //genrating hashed password
          bcrypt.genSalt(10, (err, salt) => {bcrypt.hash(new_password, salt, (err, hash) => {
                                              if (err) throw err;
                                              const hashedPassword = hash;
                                              User.findOneAndUpdate({email:resetLinkObj.email}, {$set: {password:hashedPassword}}).then(passUpdate=>{

                                                if (!passUpdate) {
                                                  //clear the exist token
                                                    req.flash('error_msg', 'ERROR: '+"Update unsuccessfully");
                                                    res.redirect('/login');
                                               }else{
                                                       
                ResetToken.findOneAndUpdate({resetPasswordToken:`${reset_token.trim()}`}, {$set: {resetPasswordToken:tokenGenarator()}}).then(clearTheToken=>{

                                                        if(clearTheToken){
                                                          req.flash('success_msg','updated successfully');
                                                          res.redirect('/login');
                                                        }else{
                                                          req.flash('error_msg', 'ERROR: '+"Update unsuccessfully");
                                                          res.redirect('/login');
                                                        }

                                                      });
                                                    
                                                      

                                                   
                                                  }
                                              });
                        });
          });
        }
      });


    }  

      
      

 } catch (error) {
 
        req.flash('error_msg', 'ERROR: '+`${error}`);
        res.redirect('/forget');

  
 } 
     

  
  
          
  
     


}