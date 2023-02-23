const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './config.env') })
module.exports={
    MONGOURL: process.env.MONGOURL,
    port:process.env.PORT || 4041,
    SENDGRID_API_KEY:process.env.SENDGRID_API_KEY
    
};