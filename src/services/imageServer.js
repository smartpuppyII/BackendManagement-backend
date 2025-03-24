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