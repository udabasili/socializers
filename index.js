let server = require('./loaders/app')
const config = require('./config');
const loggerFunction = require('./loaders/logger')
let io = require('./loaders/socketIo')


const app = server.listen(config.port, function(){
    loggerFunction("info", `Serving is running on PORT ${config.port}`)

})
io = io.init(app)
io.on('connection', () =>{
    loggerFunction("info", `User is connect to Socket IO `)

})
