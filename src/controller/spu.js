const spuService = require('../services/spuService')

// 获取SPU列表
exports.getSpuList = async(req, res) => {
    try {
        const { page = 1, pageSize = 10, keyword = '' } = req.query
        const result = await spuService.getSpuList(page, pageSize, keyword)
        const total = await spuService.getSpuCount(keyword)
        
        res.send({
            status: 200,
            message: 'get spu list success',
            data: {
                list: result,
                total: total[0].total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
            }
        })
    } catch (error) {
        return res.err(500, 'get spu list failed: ' + error)
    }
}

// 获取SPU详情
exports.getSpuDetail = async(req, res) => {
    const { spuId } = req.query
    if (!spuId) {
        return res.err(400, 'spuId is required')
    }

    try {
        // 获取SPU基本信息
        const spuInfo = await spuService.getSpuById(spuId)
        
        if (spuInfo.length === 0) {
            return res.err(404, 'spu not found')
        }
        
        // 获取SPU图片
        const images = await spuService.getSpuImages(spuId)
        
        // 获取SPU销售属性
        const saleAttrs = await spuService.getSpuSaleAttrs(spuId)
        
        // 为每个销售属性获取属性值
        const saleAttrsWithValues = await Promise.all(
            saleAttrs.map(async (attr) => {
                const values = await spuService.getSpuSaleAttrValues(spuId, attr.attr_id)
                return {
                    ...attr,
                    attrValues: values
                }
            })
        )
        
        const result = {
            ...spuInfo[0],
            images,
            saleAttrs: saleAttrsWithValues
        }
        
        res.send({
            status: 200,
            message: 'get spu detail success',
            data: result
        })
    } catch (error) {
        return res.err(500, 'get spu detail failed: ' + error)
    }
}

// 添加SPU
exports.addSpu = async(req, res) => {
    const spuData = req.body
    const { spu_name, description = '', category_id, brand_id, images = [], saleAttrs = [] } = spuData
    
    if (!spu_name || !category_id || !brand_id) {
        return res.err(400, 'spu_name, category_id and brand_id are required')
    }
    
    try {
        // 添加SPU基本信息
        const result = await spuService.addSpu({
            spu_name,
            description,
            category_id,
            brand_id
        })
        
        const spuId = result.insertId
        
        // 添加SPU图片
        if (images && images.length > 0) {
            await Promise.all(images.map(async (image, index) => {
                // 第一张图片默认为主图
                const isMain = index === 0 ? 1 : 0
                await spuService.addSpuImage(spuId, image, isMain)
            }))
        }
        
        // 添加SPU销售属性和属性值
        if (saleAttrs && saleAttrs.length > 0) {
            await Promise.all(saleAttrs.map(async (attr) => {
                // 添加销售属性
                await spuService.addSpuSaleAttr(spuId, attr.attr_id, attr.attr_name)
                
                // 添加销售属性值
                if (attr.attrValues && attr.attrValues.length > 0) {
                    await Promise.all(attr.attrValues.map(async (value) => {
                        await spuService.addSpuSaleAttrValue(spuId, attr.attr_id, value)
                    }))
                }
            }))
        }
        
        res.send({
            status: 200,
            message: 'add spu success',
            data: {
                spu_id: spuId
            }
        })
    } catch (error) {
        return res.err(500, 'add spu failed: ' + error)
    }
}

// 更新SPU
exports.updateSpu = async(req, res) => {
    const spuData = req.body
    const { spu_id, spu_name, description, category_id, brand_id, images, saleAttrs } = spuData
    
    if (!spu_id) {
        return res.err(400, 'spu_id is required')
    }
    
    try {
        // 检查SPU是否存在
        const existingSpu = await spuService.getSpuById(spu_id)
        if (existingSpu.length === 0) {
            return res.err(404, 'spu not found')
        }
        
        // 更新SPU基本信息
        await spuService.updateSpu({
            spu_id,
            spu_name,
            description,
            category_id,
            brand_id
        })
        
        // 如果提供了图片，则更新SPU图片
        if (images && images.length > 0) {
            // 删除原有图片
            await spuService.deleteSpuImages(spu_id)
            
            // 添加新图片
            await Promise.all(images.map(async (image, index) => {
                // 第一张图片默认为主图
                const isMain = index === 0 ? 1 : 0
                await spuService.addSpuImage(spu_id, image, isMain)
            }))
        }
        
        // 如果提供了销售属性，则更新SPU销售属性
        if (saleAttrs && saleAttrs.length > 0) {
            // 删除原有销售属性值
            await spuService.deleteSpuSaleAttrValues(spu_id)
            
            // 删除原有销售属性
            await spuService.deleteSpuSaleAttrs(spu_id)
            
            // 添加新销售属性和属性值
            await Promise.all(saleAttrs.map(async (attr) => {
                // 添加销售属性
                await spuService.addSpuSaleAttr(spu_id, attr.attr_id, attr.attr_name)
                
                // 添加销售属性值
                if (attr.attrValues && attr.attrValues.length > 0) {
                    await Promise.all(attr.attrValues.map(async (value) => {
                        await spuService.addSpuSaleAttrValue(spu_id, attr.attr_id, value)
                    }))
                }
            }))
        }
        
        res.send({
            status: 200,
            message: 'update spu success',
            data: {
                spu_id
            }
        })
    } catch (error) {
        return res.err(500, 'update spu failed: ' + error)
    }
}

// 删除SPU
exports.deleteSpu = async(req, res) => {
    const { spu_id } = req.body
    
    if (!spu_id) {
        return res.err(400, 'spu_id is required')
    }
    
    try {
        // 检查SPU是否存在
        const existingSpu = await spuService.getSpuById(spu_id)
        if (existingSpu.length === 0) {
            return res.err(404, 'spu not found')
        }
        
        // 检查SPU是否有关联的SKU
        const relatedSkus = await spuService.getSpuSkus(spu_id)
        if (relatedSkus.length > 0) {
            return res.err(400, 'cannot delete spu with associated skus, please delete skus first')
        }
        
        // 删除SPU销售属性值
        await spuService.deleteSpuSaleAttrValues(spu_id)
        
        // 删除SPU销售属性
        await spuService.deleteSpuSaleAttrs(spu_id)
        
        // 删除SPU图片
        await spuService.deleteSpuImages(spu_id)
        
        // 删除SPU
        await spuService.deleteSpu(spu_id)
        
        res.send({
            status: 200,
            message: 'delete spu success',
            data: {
                spu_id
            }
        })
    } catch (error) {
        return res.err(500, 'delete spu failed: ' + error)
    }
}

// 获取SPU关联的SKU列表
exports.getSpuSkus = async(req, res) => {
    const { spuId } = req.query
    if (!spuId) {
        return res.err(400, 'spuId is required')
    }

    try {
        // 检查SPU是否存在
        const existingSpu = await spuService.getSpuById(spuId)
        if (existingSpu.length === 0) {
            return res.err(404, 'spu not found')
        }
        
        const skus = await spuService.getSpuSkus(spuId)
        
        res.send({
            status: 200,
            message: 'get spu skus success',
            data: {
                spuId,
                spuName: existingSpu[0].spu_name,
                skus
            }
        })
    } catch (error) {
        return res.err(500, 'get spu skus failed: ' + error)
    }
} 