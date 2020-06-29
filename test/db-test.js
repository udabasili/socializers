const mongoose = require("mongoose");
const {MongoMemoryServer} = require("mongodb-memory-server")
const mongod = new MongoMemoryServer();

module.exports.createDb = async () => {
    const uri = await mongod.getConnectionString();
    const mongodOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    await mongoose.connect(uri, mongodOpts)
}

module.exports.closeDb = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop()

}

module.exports.clearDb = async () => {
    const collections =  mongoose.connection.collection;
    for (const key in  collections){
        const collection = collections[key];
        await collection.deleteMany()
    }


}