let io = null;

const server = require('./app')
const socket = {}

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer)
        return io;
    },
    getIo: () =>{
        if(!io){
            throw new Error('Socket io no initialized')
        }
        return io
    }
}