const dotenv = require("dotenv");
const envFound = dotenv.config();

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (!envFound) {

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
    port: process.env.PORT || 8081,
    secretKey: process.env.SECRET_KEY,
    clientId : process.env.CLIENTID,
    newsApi: process.env.NEWS_API,
    clientSecret : process.env.CLIENT_SECRET,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ,
    googleApi : process.env.GOOGLE_API,
    cloudinaryApiKey : process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret : process.env.CLOUDINARY_API_SECRET,
    sendGridApi : process.env.SENDGRID_API_KEY,
    mongoDbProduction: process.env.MONGODB_URI,
    mongoDbDevelopment: process.env.MONGODB_URI_DEVELOPMENT
}