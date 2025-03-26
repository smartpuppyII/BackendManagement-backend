const attrService = require('../services/attrService')

exports.getTags = async(req, res) => {
    const rankId = req.query.rankId // 传过来的是对象，注意解构
    if (!rankId){
        return res.err(400,'rankId is must for find attrs')
    }

    try {
        const attrs = await attrService.getAttrs(rankId)

        try {
            // attrs.forEach(async(attr) => {
            //     const tags = await attrService.getTags(attr.attr_id)
            //     attr.tags = tags   
            // }) foreach并不会等待所有执行，本身就不支持await

            await Promise.all(attrs.map(async (attr) => {
                attr.tags = await attrService.getTags(attr.attr_id);
            }))
            
            // 相比于for……of的串行，并行会更快
            // for (const attr of attrs) {
            //     const tags = await attrService.getTags(attr.attr_id);
            //     attr.tags = tags;
            // } 串行

            res.send({
                status: 200,
                message: 'get all tags success',
                data: attrs
            })
        } catch (error) {
            return res.err(500, 'find tags fail : ' + error)
        }
    } catch (error) {
        return res.err(500, 'find attr fail : ' + error)
    }
}

exports.editTags = async(req, res) => {
    const newAttr = req.body
    const { rank_id, attr_id } = newAttr// 新增属性或修改现有属性的依据

    try {
        if (attr_id){// 自己的id存在，修改现有属性
            await attrService.updateAttr(newAttr)
        }else if (rank_id) {// 自己的id不存在，新增属性
            await attrService.addAttr(newAttr)
        }else {
            return res.err( 400, 'rank_id or attr_id is must for editing')
        }

        res.send({
            status: 200,
            message: 'edit attr success',
            data: newAttr
        })
    } catch (error) {
        return res.err( 500, 'editAttrs failed : ' + error)
    }
}