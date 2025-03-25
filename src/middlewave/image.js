const multer = require("multer")
const fs = require('fs')
const path = require('path')
const filePath = require('../config/filePath')
const uploadPath = path.join('src', filePath.image)// 相对路径

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // 确保文件夹存在
}

const storage = multer.diskStorage({
    // 保存路径
    destination: (req, file, cb) => {
        cb(null, uploadPath)// 绝对路径
    },
    filename: (req, file, cb) => {
        cb(null,  encodeURIComponent(file.originalname))
    }
})

const uploadImage = multer({
    storage,
    // dest: uploadPath,
    limits: {
        fileSize: 10 * 2024 * 2024  // 图片大小10MB限制
    }
})

module.exports = uploadImage