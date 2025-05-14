const express = require('express')
const spuRoute = express.Router()
const spuController = require('../controller/spu')

// 获取SPU列表
spuRoute.get('/list', spuController.getSpuList)

// 获取SPU详情
spuRoute.get('/detail', spuController.getSpuDetail)

// 添加SPU
spuRoute.post('/add', spuController.addSpu)

// 修改SPU
spuRoute.post('/update', spuController.updateSpu)

// 删除SPU
spuRoute.post('/delete', spuController.deleteSpu)

// 获取SPU关联的SKU列表
spuRoute.get('/skus', spuController.getSpuSkus)

module.exports = spuRoute 