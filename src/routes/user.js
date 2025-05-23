// 用户相关
const express = require('express')
const userRoute = express.Router()
const userController = require('../controller/user')// 导入用户处理函数

// 用户注册
userRoute.post('/register', userController.register)

// 用户登录
userRoute.post('/login', userController.login)

// 获取用户信息
userRoute.get('/userInfo', userController.getInfo)

// 获取所有用户信息
userRoute.get('/allUsers', userController.allInfo)

// 更新用户信息
userRoute.post('/updateInfo', userController.updateInfo)

// 删除用户信息
userRoute.post('/deleteInfo', userController.deleteInfos)

module.exports = userRoute