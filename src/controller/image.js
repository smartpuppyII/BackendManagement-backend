const filePath = require('../config/filePath')
const imageServer = require('../services/imageServer')
const { serverHost } = require('../config')
exports.upload = async(req, res) => {
    if (!req.file){
        return res.err(400, 'no file uploaded')
    }

    // 图片上传路径
    const uploadPath = `${ filePath.image }/${ req.file.filename }`

    try {
        await imageServer.addImage(uploadPath)

        res.json({
            url: `${ serverHost }${ filePath }`
        });
    } catch (error) {
        res.err(500, 'insert image_path fail')
    }
}