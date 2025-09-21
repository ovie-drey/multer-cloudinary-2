const cloudinary = require('cloudinary').v2
require('dotenv') 
cloudinary.config({ 
        cloud_name: process.env.loud_name,
        api_key: process.env.API_key , 
        api_secret: process.env.API_secret, // Click 'View API Keys' above to copy your API secret
    });
    module.exports = cloudinary