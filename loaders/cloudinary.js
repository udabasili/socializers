const cloudinary = require ('cloudinary');
const config = require("../config")

const cloudinaryConfig = function (req, res, next) {
    cloudinary.v2.config({
        cloud_name: config.cloudinaryCloudName,
        api_key: config.cloudinaryApiKey,
        api_secret: config.cloudinaryApiSecret,
        });
    next();
}

module.exports = cloudinaryConfig;

