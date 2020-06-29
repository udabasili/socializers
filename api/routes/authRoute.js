const express = require("express");
const router = express.Router({mergeParams: true});
const services = require('../../services');
const { celebrate, Joi } = require('celebrate');

router.post("/register", 
    celebrate({
        body: Joi.object({
            name: Joi.string().required(),
            username: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required().min(7),
            })
        }),
        async function(req, res, next){
            try {
                const AuthService = new services.AuthService(req.body);
                const { user, token } = await AuthService.SignUp();
                return res.status(200).json({
                    status: 200,
                    message: {
                        token: token,
                        user,
                    },
                });
                
            } catch (error) {        
                if(error.code===11000){
                    error.message = "User already exists. "            
                }
                return next({
                    status: 404,
                    message: `ERROR! ${error.message}`
                })   
            }
    }  
)

router.post("/login", 
    celebrate({
        body: Joi.object({
            email: Joi.string().required().max(30),
            password: Joi.string().required()
        })
    }),
    async function(req, res, next){    
        try {        
            const AuthService = new services.AuthService(req.body);
            const {user, token} = await AuthService.SignIn();
            return res.status(200).json({
                status: 200,
                message:{
                    token: token,
                    user
                }
            })
        } catch (error) {        
            return next({
                status: 404,
                message: `ERROR! ${error.message}`
            })      
        }
    }
)



module.exports = router