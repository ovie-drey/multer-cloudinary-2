const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.MONGODB_URI

mongoose.connect(DB).then(()=> {
    console.log('database connected successfully')
    
}).catch ((err)=>{
    console.log('error connecting to database: ', err.message);
    
});