// 图片相关
const express = require('express')
const imageRoute = express.Router()
const imageController = require('../controller/image')// 导入图片处理函数
const uploadImage = require('../src/middlewave/image')// 图片上传中间件

imageRoute.post('/image/upload', uploadImage.single('file'), imageController.upload)

module.exports = imageRoute