const db = require('../config/db')

// 获取SKU列表（分页查询）
exports.getSkuList = (page, pageSize, keyword) => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * pageSize
        let sqlstr = `
            SELECT s.*, b.brand_name, c.category_name
            FROM skus s
            LEFT JOIN brands b ON s.brand_id = b.brand_id
            LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE 1=1
        `
        
        const params = []
        
        if (keyword) {
            sqlstr += ' AND s.sku_name LIKE ?'
            params.push(`%${keyword}%`)
        }
        
        sqlstr += ' ORDER BY s.sku_id DESC LIMIT ? OFFSET ?'
        params.push(parseInt(pageSize), parseInt(offset))
        
        db.query(sqlstr, params, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 获取SKU总数
exports.getSkuCount = (keyword) => {
    return new Promise((resolve, reject) => {
        let sqlstr = 'SELECT COUNT(*) as total FROM skus WHERE 1=1'
        const params = []
        
        if (keyword) {
            sqlstr += ' AND sku_name LIKE ?'
            params.push(`%${keyword}%`)
        }
        
        db.query(sqlstr, params, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 根据ID获取SKU信息
exports.getSkuById = (skuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = `
            SELECT s.*, b.brand_name, c.category_name
            FROM skus s
            LEFT JOIN brands b ON s.brand_id = b.brand_id
            LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE s.sku_id = ?
        `
        db.query(sqlstr, skuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 获取SKU关联的属性和标签
exports.getSkuAttrs = (skuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = `
            SELECT sa.sku_id, sa.attr_id, sa.tag_id, a.attr_name, t.tag_name
            FROM sku_attrs sa
            LEFT JOIN attributes a ON sa.attr_id = a.attr_id
            LEFT JOIN tags t ON sa.tag_id = t.tag_id
            WHERE sa.sku_id = ?
        `
        db.query(sqlstr, skuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 添加SKU
exports.addSku = (skuData) => {
    return new Promise((resolve, reject) => {
        const { sku_name, price, stock, category_id, brand_id } = skuData
        const sqlstr = 'INSERT INTO skus (sku_name, price, stock, category_id, brand_id) VALUES (?, ?, ?, ?, ?)'
        
        db.query(sqlstr, [sku_name, price, stock, category_id, brand_id], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Insert sku failed')
            }
        })
    })
}

// 更新SKU
exports.updateSku = (skuData) => {
    return new Promise((resolve, reject) => {
        const { sku_id, sku_name, price, stock, category_id, brand_id } = skuData
        const sqlstr = 'UPDATE skus SET sku_name = ?, price = ?, stock = ?, category_id = ?, brand_id = ? WHERE sku_id = ?'
        
        db.query(sqlstr, [sku_name, price, stock, category_id, brand_id, sku_id], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Update sku failed')
            }
        })
    })
}

// 删除SKU
exports.deleteSku = (skuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'DELETE FROM skus WHERE sku_id = ?'
        
        db.query(sqlstr, skuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Delete sku failed')
            }
        })
    })
}

// 添加SKU属性关联
exports.addSkuAttr = (skuId, attrId, tagId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'INSERT INTO sku_attrs (sku_id, attr_id, tag_id) VALUES (?, ?, ?)'
        
        db.query(sqlstr, [skuId, attrId, tagId], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Add sku attribute failed')
            }
        })
    })
}

// 删除SKU的所有属性关联
exports.deleteSkuAttrs = (skuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'DELETE FROM sku_attrs WHERE sku_id = ?'
        
        db.query(sqlstr, skuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
} 