// 表单验证
const zod = require('zod')

// 用户信息验证
const validImageForm = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif']
exports.userValidate = zod.object({
    username: zod.string().trim()
        .min(1, 'Username must be at least 1 characters')
        .max(15, 'Username must be at most 15 characters'),
    password: zod.string().trim()
        .min(2, 'Password must be at least 2 characters')
        .max(20, 'Password must be at most 20 characters'),
    avatar: zod.string()
        .startsWith('https://')
        .refine((url) => {
            // 获取 URL 后缀并检查是否在有效的图片格式列表中
            return validImageForm.some(item => url.endsWith(item))
        }, 'Avatar must be a valid image URL with one of the following extensions: png, jpg, jpeg, webp, gif')
        .optional()
})

// 品牌信息验证
exports.brandValidate = zod.object({
    name: zod.string().trim()
        .min(1, 'brandname must be at least 1 characters')
        .max(15, 'brandname must be at most 15 characters'),
    logo: zod.string().refine((url) => {
        return url.startsWith('https://')
    }, 
    'Avatar must be a valid image URL begin with \'https\'')
})

// 产品信息验证