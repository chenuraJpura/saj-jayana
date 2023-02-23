const config=require('../conifg');
const mongoose = require("mongoose");
//checking the connection
mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

mongoose.connection.on("error", (err) => {
    console.log(`Could not connect to MongoDB because of ${err}`);
    process.exit(1);
  });

exports.start = () => {
    mongoose.connect(config.MONGOURL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify: false
    });
    
};

