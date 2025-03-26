// 分类相关
const express = require('express')
const categoryRoute = express.Router()
const categoryController = require('../controller/category')// 导入分类处理函数

// 获取一级分类
categoryRoute.get('/rank1', categoryController.getRank1)

// 获取二级分类
categoryRoute.get('/rank2', categoryController.getRank2)

// 获取三级分类
categoryRoute.get('/rank3', categoryController.getRank3)

module.exports = categoryRoute