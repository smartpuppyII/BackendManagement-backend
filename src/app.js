const express = require('express')
const app = express()
const cors = require('cors')
const errorHandler = require('./middlewave/error').errorMiddle
const { expressjwt } = require('express-jwt')// 解析token
const config = require('./config')// 全局配置对象

app.use(errorHandler)// 配置错误消息处理
app.use(cors())// 配置跨域
app.use(express.urlencoded({ extended: false }))// 配置解析文件
app.use(express.json())
app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256']}).unless({ path: ['/user/login', '/user/register']}))// 配置token解析
app.use(require('./middlewave/auth'))// token相关错误信息

app.use('/user', require('./routes/user'))// 配置用户路由

module.exports = app