// 分类相关
const express = require('express')
const categoryRoute = express.Router()
const categoryController = require('../controller/category')// 导入分类处理函数

// 获取一级分类
categoryRoute.get('/rank1', categoryController.allInfo)

// 获取二级分类
categoryRoute.get('/rank2', categoryController.allInfo)

// 获取三级分类
categoryRoute.get('/rank2', categoryController.allInfo)

// 新增分类
categoryRoute.post('/addInfo', categoryController.addInfo)

// 修改分类
categoryRoute.post('/updateInfo', categoryController.updateInfo)

// 获取某个分类
categoryRoute.get('/categoryInfo', categoryController.getInfo)

// 删除分类
categoryRoute.post('/deleteInfo', categoryController.deleteInfo)

module.exports = categoryRoute