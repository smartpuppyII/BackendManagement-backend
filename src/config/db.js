const mysql = require('mysql2')
const db = mysql.createPool({// 连接数据库
    host: 'localhost',
    port: 8000,
    user: 'root',
    password: 'qwertY#13135352106',
    database: 'tourism_db'
})

db.query('SELECT 1', (err, result) => {
    if (err){
        console.log(err.message)
        return
    }
    console.log('tourism_db connecting...')
})

module.exports = db