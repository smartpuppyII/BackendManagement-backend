const permissionService = require('../services/permissionServer')

exports.getAllPermissions = async(req, res) => {
    try {
        const permissions = await permissionService.getAllPermissions()

        // TODO: 是前端排序还是后端
        res.send({
            status: 200,
            message: 'get all tags success',
            data: permissions
        })
    } catch (error) {
        return res.err(500, 'find permission fail : ' + error)
    }
}

exports.getPermission = async(req, res) => {
    const { roleId } = req.query

    try {
        if (roleId){
            const permissions = await permissionService.getPermission(roleId)

            res.send({
                status: 200,
                message: 'get permission success',
                data: permissions
            })
        }else {
            return res.err( 400, 'roleId must for getting one\'s permission')
        }
    } catch (error) {
        return res.err( 500, 'get one\'s permission failed : ' + error)
    }
}

// 更新某个职位的权限
exports.updatePermission = async(req, res) => {
    const { roleId } = req.body
    if (!roleId){
        return res.err(400, 'roleId is must for updating permission!')
    }

    try {
        await permissionService.updatePermission(roleId)
        res.send({
            status: 200,
            message: 'update permission success',
            data: roleId
        })
    } catch (error) {
        return res.err( 500, 'update permission failed : ' + error)
    }
}