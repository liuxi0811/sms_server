var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stu');

//定义一个规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('Buka', userSchema);
