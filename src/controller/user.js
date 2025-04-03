const userService = require('../services/userService')// 导入用户数据库操作
const argon2 = require('argon2')// 密码加密
const validate = require('../middlewave/validate')// 表单验证
const jwt = require('jsonwebtoken')// 生成token
const config = require('../config/index')

exports.register = async(req, res) => {
    const userInfo = req.body
    console.log(userInfo);
    // 表单校验 trim防空格 验证失败会抛出错误
    try {
        validate.userValidate.parse(userInfo)
    } catch (error) {
        return res.err(422, 'username or password is invalid!')
    }

    // 检测重名
    try {
        const exist = await userService.usernameExist(userInfo.username)
        if (exist){
            return res.err(422, 'username has been used')
        }else {
            // 加密以后再存储到数据库
            const hashedPassword = await argon2.hash(req.body.password);
            userInfo.password = hashedPassword
            try {
                await userService.addUser(userInfo)
                return res.send({
                    status: 201,
                    message: 'register success'
                })
            } catch (error) {
                return res.err(500, error)
            }
        }
    } catch (err) {
        return res.err(500, 'Error checking username : ' + err)
    }
}

exports.login = async(req, res) => {
    const userInfo = req.body;
    console.log(userInfo);
    // 表单验证
    try {
        validate.userValidate.parse(userInfo)
    } catch (error) {
        return res.err(422, 'username or password is invalid! : ' + error)
    }

    // 比对密码
    try {
        const storedUser = await userService.usernameExist(userInfo.username)
        if (storedUser){// 用户存在
            try {
                const isMatch = await argon2.verify(storedUser.password, userInfo.password)
                if (isMatch) {
                    const user = { ...storedUser, password: '', avatar: '' }// 剔除头像和密码
                    // 发送token
                    const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
                    res.send({
                        status: 200,
                        message: 'login success',
                        token: 'Bearer ' + token// 方便客户端使用
                    })
                } else {
                    return res.err(400, 'password is wrong')
                }
            } catch (error) {
                return res.err(500, 'Password verification failed : ' + error.message)
            }
        }else {
            return res.err(404, 'user dont\'t exist')
        }
    } catch (err) {
        return res.err(500, 'Error find username : ' + err)
    }
}

exports.allInfo = async(req, res) => {
    try {
        const userInfos = await userService.allUsers()
        res.send({
            status: 200,
            message: 'get all userInfos success',
            data: userInfos
        })
    } catch (error) {
        return res.err(500, 'Error get all userInfo : ' + error)
    }
}

exports.getInfo = async(req, res) => {
    // 从token里获取信息
    const userId = req.auth.id
    
    try {
        const userInfo = await userService.getUser(userId)

        if (userInfo){
            const userRoutes = await userService.getUserRoutes(userInfo.role)
            const routes = userRoutes.routes.split(",")

            res.send({
                status: 200,
                message: 'get userInfo success',
                data: { ...userInfo, password: '', routes }// 不要包含密码
            })
        }else {
            return res.err(404, 'user dont\'t exist')
        }
    } catch (error) {
        return res.err(500, 'Error get userInfo : ' + error)
    }
}

exports.deleteInfos= async(req, res) => {
    const userIds = req.body

    try {
        await Promise.all(userIds.map(async (userId) => {
            await userService.deleteUser(userId);
        }))
        res.send({
            status: 200,
            message: 'delete userInfo success',
            data: userIds
        })
    } catch (error) {
        return res.err(500, 'Error delete userInfo : ' + error)
    }
}

exports.updateInfo = async(req, res) => {
    const userInfo = req.body

    // 表单验证
    try {
        validate.userValidate.parse(userInfo)
    } catch (error) {
        return res.err(422, error.message)
    }

    // 检查用户存在
    try {
        const user = await userService.getUser(req.auth.id)
        if (!user){
            return res.err(404, 'user not find')
        }
        // 存在就加密
        const hashedPassword = await argon2.hash(user.password);
        userInfo.password = hashedPassword
    } catch (error) {
        return res.err(500, 'Error find user : ' + error)
    }
    
    try {
        const result = await userService.updateUser(userInfo)
        if (result.affectedRows === 1){
            res.send({
                status: 200,
                message: 'update userInfo success',
                data: { ...userInfo, password: ''}
            })
        }else {
            return res.err(404, 'user not exist')
        }
    } catch (error) {
        return res.err(500, 'Error update userInfo : ' + error)
    }
}