const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cloudinaryConfig = require('./cloudinary');
const path = require('path');


/**SECURITY MIDDLEWARE */
let allowedOrigins = [
    "https://snagged-client.herokuapp.com", 
    "http://localhost:8081/",
    "http://localhost:3000/api",
    "http://localhost:3000/api",
    "http://localhost:5600/api"
]

    app.use(cors({
        origin: function(origin, callback){
            if(!origin){ //this lets mobile phones connect
                return callback(null, true)
            }
            if(allowedOrigins.indexOf(origin) === -1 ){
                let message = "The CORS policy fo the site doesn't allow access from the specified Origin"
                return callback(new Error(message), false)
            }
            return callback(null, true)
        }
    }));

   
    app.use(mongoSanitize());
    app.use(xss());
    app.use(helmet())
    app.disable('x-powered-by')



/**FUNCTIONALITY MIDDLEWARE */
    app.use(bodyParser.json({ limit: '10kb' }));
    app.use(bodyParser.urlencoded({extended: false}));;
    app.use(cloudinaryConfig);

/**ROUTE */

    require('./routes')(app);
    require('./db')()

/**STATIC FILES */  
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(__dirname));
        app.use(express.static(path.join(__dirname,'../client/build')))
        app.get('/*', (req, res)=>{
            res.sendFile(path.join(__dirname, '../client/build/index.html'))
        })
    }




module.exports = app;
