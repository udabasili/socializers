const routes = require('../api/routes');
const middleware = require('../api/middleware');
const rateLimit = require("express-rate-limit");
const limit = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: 'Too many requests' // message to send
});

/**
 * This handles setting
 * @param {*} app 
 */
module.exports = function(app) {
    app.use("/api/auth", limit, routes.authRoute);
    app.get('/authenticate-user', middleware.authHandler.confirmAuthentication)
    app.use("/api/:userId", middleware.authHandler.setCurrentUser,
        middleware.authHandler.protectedRoute, routes.userRoute);
    app.use("/api/:userId", middleware.authHandler.setCurrentUser,
        middleware.authHandler.protectedRoute, routes.postRoute);
    app.use(function(req, res, next){
        let error = new Error("Page not found")
        error.status = 404
        next(error)
    })
    app.use(middleware.errorHandler);


}