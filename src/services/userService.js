const db = require('../config/db');

exports.usernameExist = (username) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT * FROM users WHERE username = ?';
        db.query(sqlstr, username, (err, result) => {
            if (err) {
                reject(err.message)
            }
            resolve(result[0])
        })
    })
}

exports.allUsers = () => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT * FROM users'
        db.query(sqlstr, (err, result) => {
            if (err) {
                reject(err.message)
            }
            resolve(result)
        })
    })
}

exports.getUser = (userId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT * FROM users WHERE id = ?';
        db.query(sqlstr, userId, (err, result) => {
            if (err) {
                reject(err.message);
            }
            if (result && result.length !== 0) {
                resolve(result[0]);
            } else {
                resolve(false);
            }
        })
    })
}

exports.getUserRoutes = (roleName) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'SELECT routes FROM roles LEFT JOIN routes ON roles.role_id = routes.role_id  WHERE roles.role_name = ?';
        db.query(sqlstr, roleName, (err, result) => {
            if (err) {
                reject('get userRoutes error : ' + err.message);
            }
            if (result) {
                resolve(result[0]);
            } else {
                resolve(false);
            }
        })
    })
}

// 新增用户 必要字段只有名字和密码
exports.addUser = (userInfo) => {
    return new Promise((resolve, reject) => {
        // 使用解构排除 check 字段
        const { check, ...safeUserInfo } = userInfo
        const sqlstr = 'INSERT INTO users SET ?'
        const insertData = { ...safeUserInfo, id: null}
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

// 更新用户
exports.updateUser = (userInfo) => {
    return new Promise((resolve, reject) => {
        const updateData = { ...userInfo }
        delete updateData.id // 防止id被修改

        const sqlstr = 'UPDATE users SET ? WHERE id = ?'
        db.query(sqlstr, [updateData, userInfo.id], (err, result) => {
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

// 删除用户，可以优化为逻辑删除
exports.deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'DELETE FROM users WHERE id = ?'
        db.query(sqlstr, userId, (err, result) => {
            if (err){
                reject(err.message)
            }
            resolve(result)
        })
    })
}