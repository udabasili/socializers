const express = require("express");
const app = express();
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cloudinaryConfig = require("../utils/cloudinaryConfig")
const cors = require('cors')
//MIDDLEWARE PACKAGES
//for security
app.use(mongoSanitize());
app.use(xss());
app.use(cors())

//others


app.use(cloudinaryConfig)

//routes
app.use("/api/auth", limit, authRouter);
app.use("/api",  userRoute);


app.use(function(req, res, next){
    let error = new Error("Page not found")
    error.status = 404
    next(error)
})

app.use(errorHandler);

module.exports = app;
