const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    username:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
    },
    city:{
        type: String
    },
    country:{
        type: String
    },
 
    dateOfBirth:{
        type: Date
    },
    occupation:{
        type: String
    },
   
    bio:{
        type: String
    },

    ethnicity:{
        type: String
    },
    socketId:{
        type: String
    },
    userImages:[{
        type: String
    }],
    interests:{
        movieGenre: {
            type: Array
        },
        sports: {
            type: Array
        },
        musicGenre: {
            type: Array
        },
        hobbies: {
            type: Array
        }
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    friends:{
        type: Array
    }
    
})

userSchema.methods.encryptPassword = async function(req, res, next){
    try {
        let password = await bcrypt.hash(this.password, 10)
        this.password = password
    } catch (error) {
        return error
    }

}

userSchema.methods.comparePassword = async function(password){
    let isMatched = false;
    try {
        if(password){            
            isMatched = await bcrypt.compare(password, this.password)
        }
        return isMatched
    } catch (error) {
        return isMatched
    }

}

userSchema.methods.filterData = async function () {
    let user = this.toObject();
    delete user.email;
    delete user.password;
    return user
    
}

userSchema.methods.addFriend = async function (user) {
    try {
        const friends = [...this.friends]
        const friendExists = friends.find((friend) =>{
            return friend.username === user.username
        })
        if(!friendExists){
            friends.push(user)
            this.friends = friends
            this.save()
        }

        user = this.toObject();
        delete user.email;
        delete user.password;
        return user
    } catch (error) {
        return error
    }
    
}

module.exports =  mongoose.model("User", userSchema);