const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// How to create methods in Schemas? :
userSchema.methods.encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;    // This is what I'll save
}

userSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password);     // Second param is the passwd in the data model
}

module.exports = mongoose.model('User', userSchema);