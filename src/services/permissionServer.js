const db = require('../config/db')

// 获取所有权限
exports.getAllPermissions = () => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT * FROM permissions'
        db.query(sqlstr, (err, result) => {
            if (err){
                return reject(err)
            }
            resolve(result)
        })
    })
}

// 获取角色权限
exports.getPermission = (roleId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT * FROM permissions where id = ?'
        db.query(sqlstr, roleId, (err, result) => {
            if (err){
                return reject(err)
            }
            resolve(result)
        })
    })
}