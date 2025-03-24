// 品牌相关
const express = require('express')
const brandRoute = express.Router()
const brandController = require('../controller/brand')// 导入品牌处理函数

// 获取所有品牌以及品牌总数
brandRoute.get('/allInfo', brandController.allInfo)

// 新增品牌
brandRoute.post('/addInfo', brandController.addInfo)

// 修改品牌
brandRoute.post('/updateInfo', brandController.updateInfo)

// 获取某个品牌
brandRoute.get('/brandInfo', brandController.getInfo)

// 删除品牌
brandRoute.post('/deleteInfo', brandController.deleteInfo)

module.exports = brandRoute