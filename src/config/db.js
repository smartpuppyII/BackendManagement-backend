const mysql = require('mysql2')
const db = mysql.createPool({// 连接数据库
    host: '8.138.213.130',
    port: 3306,
    user: 'management_db',
    password: 'me5SxseexNizP3xf',
    database: 'management_db'
})

db.query('SELECT 1', (err, result) => {
    if (err){
        console.log(err.message)
        return
    }
    console.log('management_db connecting...')
})

module.exports = db