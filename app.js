const express = require('express');
const config=require('./conifg');
const expressLayouts = require('express-ejs-layouts');
const mongooseConnection = require('./services/mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const { expressCspHeader, INLINE,SELF} = require('express-csp-header');
const app = express();
app.use(cors());

app.use(helmet());


app.use(expressCspHeader({
    directives: {
      
        'default-src': [SELF,INLINE,'https://fonts.gstatic.com/s/aladin/v9/ZgNSjPJFPrvJV5fF7i35.woff2','https://fonts.gstatic.com/s/poppins/v15/pxiByp8kv8JHgFVrLFj_Z1JlFc-K.woff2','https://fonts.gstatic.com/s/aladin/v9/ZgNSjPJFPrvJV5fF7i35.woff2'],
        
        'script-src': [SELF,INLINE,
          'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
          'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js',
          'https://code.jquery.com/jquery-3.5.1.slim.min.js'],
        'style-src': [SELF,INLINE,'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        'fonts.googleapis.com',
      ],
        'font-src':[SELF],
        'img-src': [SELF,INLINE],
        'worker-src': [SELF,INLINE],
        'block-all-mixed-content': true,
    }
   
}));


// Passport Config
require('./controllers/passport')(passport);

// Connect to MongoDB
mongooseConnection.start();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1*24*60*60*1000}
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users',require('./routes/users.js'));
app.use('/task', require('./routes/task.js'));
app.use('/counter', require('./routes/counter.js'));

//starting node server
app.listen(config.port,(err)=>{
  if(err){
      console.log(`Error: ${err}`);
      process.exit(-1);
  }else{
      console.log(`App Started ${config.port}`);
  }
 
});

