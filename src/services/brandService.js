const db = require('../config/db');

exports.allbrand = () => {
    return new Promise((resolve, reject) => {
        const sqlstr1 = 'SELECT count(*) AS total FROM brands'
        const sqlstr2 = 'SELECT * FROM brands'
        db.query(sqlstr1, (err, total) => {
            if (err) {
                return reject(err.message);
            }
            db.query(sqlstr2, (err, brands) => {
                if (err) {
                    return reject(err.message)
                }
                resolve({
                    total: total[0].total,
                    brands
                })
            })
        })
    })
}

exports.brandExist = (brandname) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT * FROM brands WHERE name = ?';
        db.query(sqlstr, brandname, (err, result) => {
            if (err) {
                reject(err.message);
            }
            if (result.length !== 0) {
                resolve(result[0]);
            } else {
                reject('brand not exist');
            }
        })
    })
}

exports.getbrand = (brandId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT * FROM brands WHERE id = ?';
        db.query(sqlstr, brandId, (err, result) => {
            if (err) {
                reject(err.message);
            }
            if (result.length !== 0) {
                resolve(result[0]);
            } else {
                resolve(false);
            }
        })
    })
}

// 新增品牌 必要字段只有名字和密码
exports.addbrand = (brandInfo) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'INSERT INTO brands SET ?'
        const insertData = { ...brandInfo, id: null}// 防止写入id auto增加不要写字段
        
        db.query(sqlstr, insertData, (err, result) => {
            if (err){
                reject(err.message)
            }
            // 返回插入的结果，可以获取到插入的 ID 等信息
            if (result && result.affectedRows === 1){
                resolve(result)
            }else {
                reject('insert failed')// 就是另一边收到的err
            }
        })
    })
}

// 更新品牌
exports.updatebrand = (brandInfo) => {
    return new Promise((resolve, reject) => {
        const updateData = { ...brandInfo }
        delete updateData.id // 防止id被修改

        const sqlstr = 'UPDATE brands SET ? WHERE id = ?'
        db.query(sqlstr, [updateData, brandInfo.id], (err, result) => {
            if (err){
                reject(err.message)
            }
            if (result && result.affectedRows === 1){
                resolve(result)
            }else {
                reject('update failed')
            }
        })
    })
}

exports.deletebrand = ( brandId ) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'DELETE FROM brands WHERE id = ?'
        db.query(sqlstr, brandId, (err, result) => {
            if (err){
                reject(err.message)
            }
            if (result && result.affectedRows === 1){
                resolve(result)
            }else {
                reject('delete failed')
            }
        })
    })
}