const multer = require("multer")
const path = require('path')
const uploadPath = path.join(__dirname, 'upload')// 绝对路径
console.log('uploadPath ' + uploadPath);
const uploadImage = multer({
    dest: uploadPath,// 图片在服务器的存储路径
    limits: {
        fileSize: 10 * 2024 * 2024  // 图片大小10MB限制
    }
})

module.exports = uploadImage