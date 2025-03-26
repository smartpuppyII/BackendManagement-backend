const categoryServer = require('../services/categoryService')

exports.getRank1 = async(req, res)  => {
    // 无token不允许访问
    try {
        const ranks1 = await categoryServer.getRank('NULL')
        res.send({
            status: 200,
            message: 'get rank1 success',
            data: ranks1
        })
    } catch (error) {
        return res.err(500,'get rank1 failed : ' + error)
    }
}

exports.getRank2 = async(req, res)  => {
    console.log("getRank2 Received request:", req.query);  // Debug
    const rank1Id = req.query.rank1Id;  // 改成 req.query
    if (!rank1Id){
        return res.err(400,'rank1Id is must to find rank2')
    }

    try {
        const ranks2 = await categoryServer.getRank(rank1Id)
        res.send({
            status: 200,
            message: 'get rank2 success',
            data: ranks2
        })
    } catch (error) {
        return res.err(500,'get rank1 failed : ' + error)
    }
}

exports.getRank3 = async(req, res)  => {
    console.log("getRank3 Received request:", req.query);  // Debug
    const rank2Id = req.query.rank2Id;  // 改成 req.query
    if (!rank2Id){
        return res.err(400,'rank2Id is must to find rank3')
    }

    try {
        const ranks3 = await categoryServer.getRank(rank2Id)
        res.send({
            status: 200,
            message: 'get rank3 success',
            data: ranks3
        })
    } catch (error) {
        return res.err(500,'get rank3 failed : ' + error)
    }
}