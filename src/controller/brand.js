const brandService = require('../services/brandService')// 导入品牌数据库操作
const validate = require('../middlewave/validate')

exports.allInfo = async(req, res) => {
    // 添加
    try {
        const { total, brands } = await brandService.allbrand()
        console.log(total, brands)
        res.send({
            status: 200,
            message: 'get all brands success',
            data: {
                total,
                brands
            }
        })
    } catch (error) {
        return res.err(500, 'find brand fail : ' + error)
    }
}

exports.addInfo = async(req, res) => {
    const brandInfo = req.body

    // 表单校验 trim防空格 验证失败会抛出错误
    try {
        validate.brandValidate.parse(brandInfo)
    } catch (error) {
        return res.err(422, 'brand name or logo is invalid')
    }

    // 添加
    try {
        await brandService.addbrand(brandInfo)
    } catch (error) {
        return res.err(500, 'Insert brand fail : ' + error)
    }
}

exports.updateInfo = async(req, res) => {
    const brandInfo = req.body;

    if (!brandInfo.id){
        return res.err(400, 'brandInfo must contains id!')
    }

    // 表单验证
    try {
        validate.brandValidate.parse(brandInfo)
    } catch (error) {
        return res.err(422, 'brand name or logo is invalid')
    }

    // 靠id修改
    try {
        const result = await brandService.updatebrand(brandInfo)
        if (result.affectedRows === 1){
            res.send({
                status: 200,
                message: 'update brandInfo success',
                data: brandInfo
            })
        }else {
            return res.err(404, 'brand not exist')
        }
    } catch (err) {
        return res.err(500, 'Error find brandname : ' + err)
    }
}

exports.getInfo = async(req, res) => {
    const brandId = req.body.id

    if (!brandId){
        return res.err(400, 'brandInfo must contains id!')
    }

    try {
        const brandInfo = await brandService.getbrand(brandId)

        if (brandInfo){
            res.send({
                status: 200,
                message: 'get brandInfo success',
                data: brandInfo
            })
        }else {
            return res.err(404, 'brand dont\'t exist')
        }
    } catch (error) {
        return res.err(500, 'Error find brandname : ' + error)
    }
}

// TODO: 修改为逻辑删除
exports.deleteInfo = async(req, res) => {
    const brandId = req.body.id

    if (!brandId){
        return res.err(400, 'brandInfo must contains id!')
    }

    // 靠id删除
    try {
        const brandInfo = await brandService.getbrand(brandId)

        if (brandInfo){
            try {
                const result = await brandService.deletebrand(brandId)

                if (result){
                    res.send({
                        status: 200,
                        message: 'delete brand success'
                    })
                }else {
                    return res.err(500, 'delete failed')
                }
            } catch (error) {
                return res.err(500, 'Error delete brand : ' + error)
            }
        }else {
            return res.err(404, 'brand dont\'t exist')
        }
    } catch (error) {
        return res.err(500, 'Error find brand : ' + error)
    }
}