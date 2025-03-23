// token处理
const authError = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError'){
        return res.err(401, err, )
    }
    next()
}

module.exports = authError