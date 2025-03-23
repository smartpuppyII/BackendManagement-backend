// 返回错误日志
exports.errorMiddle = (req, res, next) => {
    res.err = (status, err) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
}