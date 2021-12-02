var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    email:{
        type:String,
    },
    first_name:{
        type: String
    },
    last_name:{
        type: String
    }
},{
    timestamps:true
});

userSchema.virtual('full_name')
.get(function(){
    return this.first_name + ' ' + this.last_name
});

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('users', userSchema);

module.exports = User;