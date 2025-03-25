const db = require('../config/db');

exports.addImage = (uploadPath) => {
    return new Promise((resolve, reject) => {
        const sqlstr = 'INSERT INTO images SET file_path = ?';
        db.query(sqlstr, uploadPath, (err, result) => {
            if (err) {
                reject(err.message);
            }
            if (result && result.affectedRows === 1){
                resolve(result)
            }else {
                reject('insert fail')
            }
        })
    })
}

exports.getImage = (imagePath) => {
    return new Promise((resolve, reject) => {
        console.log('img : ' + imagePath);
        const sqlstr = 'SELECT * FROM images WHERE file_path LIKE ? LIMIT 1';
        db.query(sqlstr, [`%${ imagePath }%`], (err, result) => {
            if (err) {
                reject(err.message);
            }
            if (result){
                resolve(result)
            }else {
                reject('can\'t find image')
            }
        })
    })
}