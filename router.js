/*
show dbs   //查看所有数据库

use 数据库名  //进入对应的数据库

show collections  //查看所有collection (table)

db.collection名称.find()   //查看该collection下所有数据（没有条件）

db.collection名称.find(｛a:1｝)   //查看该collection下数据（有条件,属性为a.值为1）

db.help()  //显示数据库操作命令

db.collection名称.help()  //显示集合操作的命令
 
// 创建数据库

use 数据库名   //进入数据库，没有则创建

db.createCollection("user”)  // 这样就成功创建了一个数据库

//添加数据

db.collection名称.insertOne({'name':'jack'})//向当前collection中添加一条数据

db.collection名称.insert([{'name':'jack'},....])//向当前collection中添加若干数据

 */


var express = require('express');
var md5 = require('blueimp-md5');
//操作数据的module创建的时候变量名一般首字母大写,见到这种首字母大写的一般都是操作数据库的
var User = require('./user.js');
var Teacher = require('./teacher.js');
var Student = require('./student.js');
var router = express.Router();
// 注册
router.post("/user/register", function (req, res) {
    var body = req.body;
    User.find({
        $or:[
            {
                username:body.username
            },
            {
                nickname:body.nickname
            }
        ]
    },function (err,data) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if(data.length !== 0){
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "账号或昵称已存在"
            })

        }
        // body.password = md5(md5(body.password) + "buka");
        body.token = md5(md5(body.username) + "buka");
        new User(body).save(function (err,data) {
            if(err){
                // return res.status(500).send("存储失败")
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: "server error,存储失败"
                })
            }
            //存储成功，提示注册成功
            // req.session.user = data;
            return res.json({
                "code": 2000,
                "flag": true,
                "message": "注册成功"
            })
        })
    })
});
// 登录
router.post("/user/login", function (req, res) {
    var body = req.body;
    //找数据库里是否存在， 存在才能登录
    User.findOne({
        username: body.username,
        password: body.password
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "邮箱或密码不存在"
            })
        }
        //如果上面两个判断都进不去，说明找到数据了
        // req.session.user = data;
        return res.json({
            "code": 2000,
            "flag": true,
            "message": "验证成功",
            "data": {
                "token": data.token
            }
        })
    })
});
// 获取用户信息
router.get("/user/info",function (req,res) {
    var body = req.query;
    User.findOne({
        token: body.token
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "token不存在"
            })
        }
        //如果上面两个判断都进不去，说明找到数据了
        // req.session.user = data;
        return res.json({
            "code": 2000,
            "flag": true,
            "message": "成功获取用户信息",
            "data": {
                "name": data.nickname,
                "id":data._id
            }
        })
    })
});
//退出登录
router.post("/user/logout",function (req,res) {
    var body = req.body;
    User.findOne({
        token: body.token

    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "token不存在"
            })
        }
        return res.json({
            "code": 2000,
            "flag": true,
            "message": "退出成功"
        })
    })
});
//校验密码是否正确
router.post("/user/pwd",function (req,res) {
    var body = req.body;
    User.findOne({
        _id:body.userId,
        password:body.password
    },function (err,data) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if(!data){
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "密码不正确"
            })
        }
        return res.json({
            "code": 2000,
            "flag": true,
            "message": "密码正确"
        })
    })
});
//修改密码
router.put('/user/pwd',function (req,res) {
    var id = req.body.userId;
    User.findOne({
        _id:id
    },function (err,data) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if(!data){
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "密码不正确"
            })
        }
        data.password = req.body.password;
        User.findByIdAndUpdate(id,data,function (err) {
            if(err){
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: "修改密码失败"
                })
            }
            return res.status(200).json({
                "code": 2000,
                "flag": true,
                "message": "修改密码成功"
            })
        })
    })

});
/*//获取所有教师列表
router.get("/teacher/list",function (req,res) {

    Teacher.find({},function (err, data) {
        if(err) return res.status(500).json({
            code: 3000,
            flag: false,
            message: "server error"
        });
        let count = data.length;
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "查询成功",
            "data":{
                "total":count,
                "rows":data
            }
        })
    })
});*/
//获取教师列表，带分页功能
router.post("/teacher/list",function (req,res) {
    let page = req.body.page || 1;
    let size = req.body.size || 20;
    let searchMap = req.body.searchMap || {};
    let obj = {};
    searchMap.jobnumber ? obj["jobnumber"] = searchMap.jobnumber : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.role ? obj["role"] = searchMap.role : obj;
    searchMap.entrydate ? obj["entrydate"] = searchMap.entrydate : obj;
    Teacher.find(obj,function (err, data) {
        if(err) return res.status(500).json({
            code: 3000,
            flag: false,
            message: "查询失败"
        });
        let count = data.length;
        //skip代表要跳过多少条，limit代表要查询多少条，exec相当于执行前面的内容，之前用find方法里面可以直接传回调函数，
        // 现在加了分页功能后需要exec才能执行，然后在参数中的回调李米娜获取数据
        Teacher.find(obj).skip((page - 1)*parseInt(size)).limit(parseInt(size)).exec(function (err, data) {
            if(err) return res.status(500).json({
                code: 3000,
                flag: false,
                message: '服务器繁忙，请稍后重试！'
            });
            return res.status(200).json({
                "code": 2000,
                "flag": true,
                "message": "查询成功",
                "data":{
                    "total":count,
                    "rows":data
                }
            })
        })
    })
});
//新增教师
router.post("/teacher",function (req,res) {
    new Teacher(req.body).save(function (err) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "新增失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "新增成功"
        })

    })
});
//根据id查询要修改的教师
router.get("/teacher",function (req,res) {
    Teacher.findById(req.query.id,function (err, data) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "根据id查询教师失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "根据id查询教师成功",
            "data":data
        })
    });
});
//根据id修改的教师
router.put('/teacher',function (req,res) {
    var id = req.body._id;
    Teacher.findByIdAndUpdate(id,req.body,function (err) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "修改教师信息失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "修改教师信息成功"
        })
    })
});

//删除教师
router.delete('/teacher',function (req,res) {
    Teacher.findByIdAndRemove(req.body.id,function (err) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "删除教师失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "删除教师成功"
        })
    })
});

//获取学生列表，带分页功能
router.post("/students/list",function (req,res) {
    let page = req.body.page || 1;
    let size = req.body.size || 20;
    let searchMap = req.body.searchMap || {};
    let obj = {};
    searchMap.stunum ? obj["stunum"] = searchMap.stunum : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.admissiondate ? obj["admissiondate"] = searchMap.admissiondate : obj;
    searchMap.teacher ? obj["teacher"] = searchMap.teacher : obj;
    searchMap.class ? obj["class"] = searchMap.class : obj;
    Student.find(obj,function (err, data) {
        if(err) return res.status(500).json({
            code: 3000,
            flag: false,
            message: "查询失败"
        });
        let count = data.length;
        Student.find(obj).skip((page - 1)*parseInt(size)).limit(parseInt(size)).exec(function (err, data) {
            if(err) return res.status(500).json({
                code: 3000,
                flag: false,
                message: '学生分页查询失败'
            });
            return res.status(200).json({
                "code": 2000,
                "flag": true,
                "message": "查询成功",
                "data":{
                    "total":count,
                    "rows":data
                }
            })
        })
    })
});
//新增学生
router.post("/students",function (req,res) {
    new Student(req.body).save(function (err) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "新增学生失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "新增学生成功"
        })

    })
});
//根据id查询要修改的学员
router.get("/students",function (req,res) {
    Student.findById(req.query.id,function (err, data) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "根据id查询学员失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "根据id查询学员成功",
            "data":data
        })
    });
});
//根据id修改的学员
router.put('/students',function (req,res) {

    var id = req.body._id;
    Student.findByIdAndUpdate(id,req.body,function (err) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "修改学员信息失败"
            })
        }

        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "修改学员信息成功"
        })
    })
});
//删除学员
router.delete('/students',function (req,res) {
    Student.findByIdAndRemove(req.body.id,function (err) {
        if(err){
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "删除学员失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "删除学员成功"
        })
    })
});

module.exports = router;