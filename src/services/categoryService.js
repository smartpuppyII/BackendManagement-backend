const db = require('../config/db')

exports.getRank = (parentId) => {
    return new Promise((resolve, reject) => {
        // 注意is null和= null的区别
        const sqlstr1 = parentId === 'NULL' 
            ? 'SELECT * FROM ranks WHERE parent_id IS NULL'
            : 'SELECT * FROM ranks WHERE parent_id = ? '
        db.query(sqlstr1, parentId ,(err, result) => {
            if (err) {
                return reject(err.message);
            }
            resolve(result)
        })
        setTimeout(() => reject('request is out of limit'), 3000)
    })
}