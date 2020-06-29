const jwt = require('jsonwebtoken');
const config = require('../config');
const Models = require('../models') 
const logger = require('../loaders/logger');
const crypto = require('crypto');

/**
 * Handle authentication functions
 */
class AuthService {

    constructor(user){
        this.user = user;
    }

    /**
     * 
     * @param {Object} user 
     * @returns {String} jwt
     * create the jwt token based on user input
     */
    generateToken (user){
        const u = {
            username: user.username,
            _id: user._id.toString(),
            imageUrl: user.imageUrl
        };
        return jwt.sign(u, config.secretKey, {
           expiresIn: 60 * 60 * 24 
        });
    }
    
    /**
     * handles creating new user account
     * @returns {Object} newUser
     */
    async SignUp() {
        logger('silly', `Creating user db record`)                
        let newUser = await Models.User.create(this.user);
        logger('silly', `Hashing password`)                
        await newUser.encryptPassword()
        newUser = await newUser.save();
        logger("silly", `Generating JWT`);
        let token = await this.generateToken(newUser);
        let user = await newUser.filterData();
        logger('silly', `User account has been created`)                
        return { user, token };

    }

    async SignIn() {
        const {email, password} = this.user;
        let user = await Models.User.findOne({email}); 
        if (user) {
            let passwordMatched = await user.comparePassword(password);
            if(passwordMatched){
                logger('silly', `Generating JWT`) 
                let token = await this.generateToken(user)
                user = await user.filterData()
                logger('info', `${user.username} has logged in`) 
                return {user, token}
            }else{
                throw new Error("email/password don't match")
            }
            
         } else {
            throw new Error("User doesn't exit. Please Register")
        }               
    }

}



module.exports = AuthService;