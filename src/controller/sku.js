const skuService = require('../services/skuService')

// 获取SKU列表
exports.getSkuList = async(req, res) => {
    try {
        const { page = 1, pageSize = 10, keyword = '' } = req.query
        const result = await skuService.getSkuList(page, pageSize, keyword)
        const total = await skuService.getSkuCount(keyword)
        
        res.send({
            status: 200,
            message: 'get sku list success',
            data: {
                list: result,
                total: total[0].total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
            }
        })
    } catch (error) {
        return res.err(500, 'get sku list failed: ' + error)
    }
}

// 获取SKU详情
exports.getSkuDetail = async(req, res) => {
    const { skuId } = req.query
    if (!skuId) {
        return res.err(400, 'skuId is required')
    }

    try {
        const skuInfo = await skuService.getSkuById(skuId)
        const skuAttrs = await skuService.getSkuAttrs(skuId)
        
        if (skuInfo.length === 0) {
            return res.err(404, 'sku not found')
        }
        
        const result = {
            ...skuInfo[0],
            attrs: skuAttrs
        }
        
        res.send({
            status: 200,
            message: 'get sku detail success',
            data: result
        })
    } catch (error) {
        return res.err(500, 'get sku detail failed: ' + error)
    }
}

// 添加SKU
exports.addSku = async(req, res) => {
    const skuData = req.body
    const { sku_name, price, stock, category_id, brand_id, attrs } = skuData
    
    if (!sku_name || !price || !category_id || !brand_id) {
        return res.err(400, 'sku_name, price, category_id and brand_id are required')
    }
    
    try {
        // 添加SKU基本信息
        const result = await skuService.addSku({
            sku_name,
            price,
            stock: stock || 0,
            category_id,
            brand_id
        })
        
        const skuId = result.insertId
        
        // 添加SKU属性关联
        if (attrs && attrs.length > 0) {
            await Promise.all(attrs.map(async (attr) => {
                await skuService.addSkuAttr(skuId, attr.attr_id, attr.tag_id)
            }))
        }
        
        res.send({
            status: 200,
            message: 'add sku success',
            data: {
                sku_id: skuId
            }
        })
    } catch (error) {
        return res.err(500, 'add sku failed: ' + error)
    }
}

// 更新SKU
exports.updateSku = async(req, res) => {
    const skuData = req.body
    const { sku_id, sku_name, price, stock, category_id, brand_id, attrs } = skuData
    
    if (!sku_id) {
        return res.err(400, 'sku_id is required')
    }
    
    try {
        // 检查SKU是否存在
        const existingSku = await skuService.getSkuById(sku_id)
        if (existingSku.length === 0) {
            return res.err(404, 'sku not found')
        }
        
        // 更新SKU基本信息
        await skuService.updateSku({
            sku_id,
            sku_name,
            price,
            stock,
            category_id,
            brand_id
        })
        
        // 如果有提供属性值，则更新SKU属性
        if (attrs && attrs.length > 0) {
            // 删除原有属性关联
            await skuService.deleteSkuAttrs(sku_id)
            
            // 添加新的属性关联
            await Promise.all(attrs.map(async (attr) => {
                await skuService.addSkuAttr(sku_id, attr.attr_id, attr.tag_id)
            }))
        }
        
        res.send({
            status: 200,
            message: 'update sku success',
            data: {
                sku_id
            }
        })
    } catch (error) {
        return res.err(500, 'update sku failed: ' + error)
    }
}

// 删除SKU
exports.deleteSku = async(req, res) => {
    const { sku_id } = req.body
    
    if (!sku_id) {
        return res.err(400, 'sku_id is required')
    }
    
    try {
        // 检查SKU是否存在
        const existingSku = await skuService.getSkuById(sku_id)
        if (existingSku.length === 0) {
            return res.err(404, 'sku not found')
        }
        
        // 先删除SKU属性关联
        await skuService.deleteSkuAttrs(sku_id)
        
        // 再删除SKU
        await skuService.deleteSku(sku_id)
        
        res.send({
            status: 200,
            message: 'delete sku success',
            data: {
                sku_id
            }
        })
    } catch (error) {
        return res.err(500, 'delete sku failed: ' + error)
    }
} 