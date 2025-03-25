// 图片相关
const express = require('express')
const imageRoute = express.Router()
const imageController = require('../controller/image')// 导入图片处理函数
const uploadImage = require('../middlewave/image')// 图片上传中间件
const filePath = require('../config/filePath')

// 保存logo文件 改成 .array('files') 或 .fields() 来处理多个文件。 .single与前端upload name字段一致
imageRoute.post('/uploadLogo', uploadImage.single('logo'), imageController.upload)

// 目前是 /download
imageRoute.get('/download/:filename', imageController.getImage)

module.exports = imageRoute