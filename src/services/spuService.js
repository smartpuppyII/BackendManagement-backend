const db = require('../config/db')

// 获取SPU列表（分页查询）
exports.getSpuList = (page, pageSize, keyword) => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * pageSize
        let sqlstr = `
            SELECT s.*, b.brand_name, c.category_name
            FROM spus s
            LEFT JOIN brands b ON s.brand_id = b.brand_id
            LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE 1=1
        `
        
        const params = []
        
        if (keyword) {
            sqlstr += ' AND s.spu_name LIKE ?'
            params.push(`%${keyword}%`)
        }
        
        sqlstr += ' ORDER BY s.spu_id DESC LIMIT ? OFFSET ?'
        params.push(parseInt(pageSize), parseInt(offset))
        
        db.query(sqlstr, params, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 获取SPU总数
exports.getSpuCount = (keyword) => {
    return new Promise((resolve, reject) => {
        let sqlstr = 'SELECT COUNT(*) as total FROM spus WHERE 1=1'
        const params = []
        
        if (keyword) {
            sqlstr += ' AND spu_name LIKE ?'
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

// 根据ID获取SPU信息
exports.getSpuById = (spuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = `
            SELECT s.*, b.brand_name, c.category_name
            FROM spus s
            LEFT JOIN brands b ON s.brand_id = b.brand_id
            LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE s.spu_id = ?
        `
        db.query(sqlstr, spuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 获取SPU的图片
exports.getSpuImages = (spuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = `
            SELECT * FROM spu_images
            WHERE spu_id = ?
            ORDER BY is_main DESC, image_id ASC
        `
        db.query(sqlstr, spuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 获取SPU的销售属性
exports.getSpuSaleAttrs = (spuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = `
            SELECT ssa.*, a.attr_name
            FROM spu_sale_attrs ssa
            LEFT JOIN attributes a ON ssa.attr_id = a.attr_id
            WHERE ssa.spu_id = ?
        `
        db.query(sqlstr, spuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 获取SPU销售属性的属性值
exports.getSpuSaleAttrValues = (spuId, attrId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = `
            SELECT * FROM spu_sale_attr_values
            WHERE spu_id = ? AND attr_id = ?
        `
        db.query(sqlstr, [spuId, attrId], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 获取SPU关联的SKU列表
exports.getSpuSkus = (spuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = `
            SELECT s.*, b.brand_name, c.category_name
            FROM skus s
            LEFT JOIN brands b ON s.brand_id = b.brand_id
            LEFT JOIN categories c ON s.category_id = c.category_id
            WHERE s.spu_id = ?
            ORDER BY s.sku_id DESC
        `
        db.query(sqlstr, spuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 添加SPU
exports.addSpu = (spuData) => {
    return new Promise((resolve, reject) => {
        const { spu_name, description, category_id, brand_id } = spuData
        const sqlstr = 'INSERT INTO spus (spu_name, description, category_id, brand_id) VALUES (?, ?, ?, ?)'
        
        db.query(sqlstr, [spu_name, description, category_id, brand_id], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Insert spu failed')
            }
        })
    })
}

// 更新SPU
exports.updateSpu = (spuData) => {
    return new Promise((resolve, reject) => {
        const { spu_id, spu_name, description, category_id, brand_id } = spuData
        const sqlstr = 'UPDATE spus SET spu_name = ?, description = ?, category_id = ?, brand_id = ? WHERE spu_id = ?'
        
        db.query(sqlstr, [spu_name, description, category_id, brand_id, spu_id], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Update spu failed')
            }
        })
    })
}

// 删除SPU
exports.deleteSpu = (spuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'DELETE FROM spus WHERE spu_id = ?'
        
        db.query(sqlstr, spuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Delete spu failed')
            }
        })
    })
}

// 添加SPU图片
exports.addSpuImage = (spuId, imagePath, isMain = 0) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'INSERT INTO spu_images (spu_id, image_path, is_main) VALUES (?, ?, ?)'
        
        db.query(sqlstr, [spuId, imagePath, isMain], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Add spu image failed')
            }
        })
    })
}

// 删除SPU的所有图片
exports.deleteSpuImages = (spuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'DELETE FROM spu_images WHERE spu_id = ?'
        
        db.query(sqlstr, spuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 添加SPU销售属性
exports.addSpuSaleAttr = (spuId, attrId, attrName) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'INSERT INTO spu_sale_attrs (spu_id, attr_id, attr_name) VALUES (?, ?, ?)'
        
        db.query(sqlstr, [spuId, attrId, attrName], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Add spu sale attribute failed')
            }
        })
    })
}

// 添加SPU销售属性值
exports.addSpuSaleAttrValue = (spuId, attrId, attrValue) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'INSERT INTO spu_sale_attr_values (spu_id, attr_id, attr_value) VALUES (?, ?, ?)'
        
        db.query(sqlstr, [spuId, attrId, attrValue], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows === 1) {
                resolve(result)
            } else {
                reject('Add spu sale attribute value failed')
            }
        })
    })
}

// 删除SPU的所有销售属性
exports.deleteSpuSaleAttrs = (spuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'DELETE FROM spu_sale_attrs WHERE spu_id = ?'
        
        db.query(sqlstr, spuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

// 删除SPU的所有销售属性值
exports.deleteSpuSaleAttrValues = (spuId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'DELETE FROM spu_sale_attr_values WHERE spu_id = ?'
        
        db.query(sqlstr, spuId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
} 