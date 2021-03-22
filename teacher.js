var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stu');

//定义一个规则对象
var Schema = mongoose.Schema;
// var json = [{'jobnumber':'00011','name':'张三11','role':'2','entrydate':'2015-12-11','phone':'13211111111'},{'jobnumber':'00012','name':'李四12','role':'2','entrydate':'2015-12-12','phone':'13311111112'},{'jobnumber':'00013','name':'王五13','role':'1','entrydate':'2015-12-13','phone':'13411111113'},{'jobnumber':'00014','name':'赵柳14','role':'2','entrydate':'2015-12-14','phone':'13111111104'},{'jobnumber':'00015','name':'张三15','role':'1','entrydate':'2015-12-15','phone':'13111111105'},{'jobnumber':'00016','name':'张三16','role':'2','entrydate':'2015-12-16','phone':'13111111106'},{'jobnumber':'00017','name':'张三17','role':'1','entrydate':'2015-12-17','phone':'13111111107'},{'jobnumber':'00018','name':'张三18','role':'2','entrydate':'2015-12-18','phone':'13111111108'},{'jobnumber':'00019','name':'张三9','role':'1','entrydate':'2015-12-19','phone':'13111111109'},{'jobnumber':'00020','name':'张三20','role':'1','entrydate':'2015-12-20','phone':'13111111120'},{'jobnumber':'00021','name':'张三21','role':'1','entrydate':'2015-12-21','phone':'13111111121'}]
var userSchema = new Schema({
    //工号
    jobnumber:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    //角色
    role:{
        type:String,
        required:true
    },
    //入职时间
    entrydate:{
        type:String,
        required:true
    },
    //电话号码
    phone:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('Teacher', userSchema);
