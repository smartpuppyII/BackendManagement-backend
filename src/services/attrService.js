const db = require('../config/db');

exports.getAttrs = (rankId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT * FROM attributes WHERE rank_id = ? ;'
        db.query(sqlstr, rankId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}

exports.updateAttr = (newAttr) => {
    // 更新属性名 更新tag 甚至是所属分类
    return new Promise((resolve, reject) => {
        const { attr_id : attrId, rank_id : rankId, attr_name : attrName } = newAttr
        const sqlstr = 'UPDATE attributes SET attr_name = ?, rank_id = ? WHERE attr_id = ?'
        db.query(sqlstr, [attrName, rankId, attrId], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows == 1){
                resolve(result)
            }else {
                return reject('insert new attr fail')
            }
        })
    })
}

exports.addAttr = (newAttr) => {
    // 新增属性
    return new Promise((resolve, reject) => {
        const { rank_id : rankId, attr_name : attrName } = newAttr
        const sqlstr1 = 'INSERT INTO attributes VALUES ( ?, ?, ? )'
        db.query(sqlstr1, [null, rankId, attrName], (err, result) => {
            if (err) {
                return reject(err.message)
            }
            if (result && result.affectedRows == 1){
                console.log(result);
                resolve(result)
            }else {
                return reject('insert new attr fail')
            }
        })
    })
}

exports.getTags = (attrId) => {
    return new Promise((resolve, reject) => {
        const sqlstr1 = 'SELECT * FROM tags WHERE attr_id = ?'
        db.query(sqlstr1, attrId, (err, result) => {
            if (err) {
                return reject(err.message)
            }
            resolve(result)
        })
    })
}