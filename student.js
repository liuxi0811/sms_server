var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stu');

//定义一个规则对象
var Schema = mongoose.Schema;
// var json = [{'stunum':'s00001','name':'小明','admissiondate':'2019-01-11','phone':'13211111111','teacher':'张三','class':'b0332','job':'','money':''},{'stunum':'s00002','name':'小红','admissiondate':'2019-01-12','phone':'13211111112','teacher':'李四','class':'b0333','job':'','money':''}]
var userSchema = new Schema({
    //学号
    stunum:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },

    //入学时间
    admissiondate:{
        type:String,
        required:true
    },
    //手机号码
    phone:{
        type:String,
        required:true
    },
    //授课教师
    teacher:{
        type:String,
        required:true
    },
    // 所在班级
    class:{
        type:String,
        required:true
    },
    //工作单位
    job:{
        type:String,
        required:true
    },
    //薪资待遇
    money:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('Student', userSchema);
