const jwt = require('jsonwebtoken');
const logger = require('../../loaders/logger');
const { User } = require('../../models');


/**
 * confirm the token user current has is valid fom the client end
 * /**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
 
const confirmAuthentication = async (req, res, next) =>{
    try {
        let token = (req.headers['authorization']).split(' ')[1];
        if (!token) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        jwt.verify(token, process.env.SECRET_KEY, async function(err, user) {
            if (err){
                return next({
                    status:401,
                    message:"unAuthorized User"
                })
            }
        const userRecord = await User.findOne({ username: user.username})
        if (!userRecord) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        const currentUser = await userRecord.filterData();
        logger('info', 'Verified User has valid token');
        return res.status(200).json({
            status:200,
            message:{
                validator:token,
                currentUser
                }
            })
        })       
    } 
    catch (error) {        
        return next({
            status:401,
            message:"unAuthorized User"
        })
    }
    
}

/**
 * confirm the token user current has is valid fom the client end
 * /**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */

const protectedRoute = function(req, res, next){
    try {
        let token = (req.headers['authorization']).split(' ')[1];
        if (!token) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        jwt.verify(token, process.env.SECRET_KEY, async function(error, decoded){
            if (decoded) {
                logger('info', 'Current User is permitted access to this route');
                next();
            } 
            else {
                return next({
                    status:401,
                    message:"unAuthorized Used"
                })
              }   
            })     
        } 
        catch (error) {            
            return next({
                status:401,
                message:"unAuthorized User"
        })
    }
        
}

/**
 * set the current user based on the use id passed fom the link
 * /**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */

const setCurrentUser  = function(req, res, next){
    try {
        let token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return next({
                status:401,
                message:"unAuthorized User"
            })
        }
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
            if(err){
                return next({
                    status: 401,
                    message: "unAuthorized User"
                })
            }
            let decodedId = decoded._id;
            let paramsId =  req.params.userId;
            if (decoded && decodedId === paramsId){     
                let user = await User.findOne({
                    username: decoded.username
                })       
                let filteredData = await user.filterData()
                req.currentUser = filteredData ; 
                logger('info', `User ${req.currentUser.username} communicated with the server`)
                return next();
            }               
            else {
                return next({
                    status:401,
                    message:"unAuthorized User"
                })
            }
        })
    }
    catch(error){
        return next({
            status:401,
            message:"unAuthorized User"
            })
        }
    }

module.exports = {confirmAuthentication, setCurrentUser, protectedRoute}