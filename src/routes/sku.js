const express = require('express')
const skuRoute = express.Router()
const skuController = require('../controller/sku')

// 获取SKU列表
skuRoute.get('/list', skuController.getSkuList)

// 获取SKU详情
skuRoute.get('/detail', skuController.getSkuDetail)

// 添加SKU
skuRoute.post('/add', skuController.addSku)

// 修改SKU
skuRoute.post('/update', skuController.updateSku)

// 删除SKU
skuRoute.post('/delete', skuController.deleteSku)

module.exports = skuRoute 