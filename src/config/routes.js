const noTokenRoutes = [
    '/user/login',
    '/user/register',
    new RegExp('^\/brand'),
    new RegExp('^\/image'),
    new RegExp('^\/file'),
    new RegExp('^\/upload')
]
module.exports = noTokenRoutes