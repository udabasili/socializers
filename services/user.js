const mongoose = require("mongoose");
const Models = require('../models') 
const logger = require('../loaders/logger');
const config = require('../config');
const Client = require("@googlemaps/google-maps-services-js").Client;
const client = new Client({});

/**
 * Handle user functions
 */
class UserService {

    constructor(user=null){
        this.user = user;
    }

    static async getUsers(){
        const users = await Models.User.find().select({
            email: 0,
            password: 0
        })
        return users
    }
    /**
     * 
     * @param {Object} user 
     * @returns {String} jwt
     * create the jwt token based on user input
     */
    
     static async imageUploads(imageFiles,userId ){
        userId = mongoose.Types.ObjectId(userId);
        let user = await Models.User.findById(userId)
        let files = imageFiles;    
        files.forEach(file => {
            user.userImages.push(file.path)
        });
        logger('info', `User ${user.username} added images to users's database `)
        user = await user.save()
        user = await user.filterData()
        return user;
     }

    /**
     * Uses google reverseGeocode to convert users longitude and latitude to 
     * get user's location
     * @param {Object} geoLocation 
     * @returns {array} 
     */
    static async getUserLocation(geoLocation){
        const api = config.googleApi;
        let lat  = geoLocation.lat
        let long = geoLocation.long
        const response = await client.reverseGeocode({
            params: {
                latlng: [lat, long],
                key: api
            },
            timeout: 1000 // milliseconds
            })
        let location;
        if (response.status === 200){
            location  = response.data.results[5].formatted_address
        }

        return location;
         
    }

    /**
     * Adds user's additional info to the database
     * @param {String} userId 
     * @param {Object} userData 
     * @returns {Object} user
     */
    static async addUserInfo(userId, userData) {
        try {
            userId = mongoose.Types.ObjectId(userId);
            let user = await Models.User.findById(userId);
            if (user) {
                user.gender = userData.gender;
                user.city = userData.city;
                user.country = userData.country;
                user.dateOfBirth = new Date(userData.birth);
                user.occupation = userData.occupation;
                user.ethnicity = userData.ethnicity;
                user = await user.save();
                return user
            } else {
                throw new Error("user id not in database")
            }


        } catch (error) {
            console.log(error);

            return next({
                status: 400,
                message: error.message
            })
        }
    }
    
    
    /**
     * Edit user's additional info to the database
     * @param {String} userId 
     * @param {Object} userData 
     * @returns {Object} user
     */
    static async editUserInfo(userId, userData) {
        try {
            userId = mongoose.Types.ObjectId(userId);
            const userRecord = await Models.User.findByIdAndUpdate(userId,
                { 
                gender :userData.gender,
                city : userData.city,
                country : userData.country,
                dateOfBirth : new Date(userData.birth),
                occupation : userData.occupation,
                ethnicity : userData.ethnicity,
            },{new: true});
            const users = await Models.User.find().select({
                email: 0,
                password: 0
            })
            return {userRecord, users}


        } catch (error) {
            return next({
                status: 400,
                message: error.message
            })
        }
    }

     /**
     * Adds user's interest to the database
     * @param {String} userId 
     * @param {Object} userData 
     * @returns {Object} user
     */
    static async addUserInterest(userId, userData){
        userId = mongoose.Types.ObjectId(userId);
        let user = await Models.User.findById(userId);
        if (user) {
            user.bio = userData.bio;
            user.interests.movieGenre = userData.movieGenre;
            user.interests.sports = userData.sports;
            user.interests.hobbies = userData.marital;
            user.interests.musicGenre = user.musicGenre;
            user = await user.save();
            const users = await Models.User.find().select({
                email: 0,
                password: 0
            })
            return {user, users};      

        } else {
           throw new Error("user id not in database") 
        } 
    }

}



module.exports = UserService;