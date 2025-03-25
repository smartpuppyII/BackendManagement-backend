const filePath = require('../config/filePath')
const imageServer = require('../services/imageServer')
const { serverHost } = require('../config')
const fs = require('fs')
exports.upload = async(req, res) => {

    console.log(req.file)
    if (!req.file){
        return res.err(400, 'no file uploaded')
    }

    // 数据库图片保存路径
    const uploadPath = `${ filePath.image }/${ req.file.filename }`

    try {
        await imageServer.addImage(uploadPath)
        res.json({
            status: 200,
            message: 'upload image success',
            data: {
                // 图片存储url
                url: `${ serverHost }/image${ filePath.image }/${ encodeURIComponent(req.file.originalname) }`
            }
        });
    } catch (error) {
        res.err(500, 'insert image_path fail : ' + error)
    }
}

// TODO: 获取图片，同时返回id与url
exports.getImage = async(req, res) => {
    if (!req.url){
        console.log('44');
        return res.err(400, 'no file uploaded')
    }

    try {
        const imageId = await imageServer.getImage(req.url.split('/')[2])// 查看是否存在于数据库, 返回id
        const path = 'src' + req.url
        console.log('path '+ path);
        
        if (!fs.existsSync(path)){
            return res.err({
                status: 500,
                message: 'file damaged'
            })
        }
        try {
            const imageData = fs.readFileSync(path)

            res.json({
                status: 200,
                message: 'get image success',
                data: {
                    imageId,
                    imageData
                }
            })
        } catch (error) {
            return res.err({
                status: 500,
                message: 'read file failed : ' + error
            })
        }
    } catch (error) {
        return res.err({
            status: 404,
            message: 'no such file uploaded : ' + error
        })
    }
}