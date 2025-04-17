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

// TODO: 修改单个属性 删除、更新……
exports.editTag = (req, res) => {

}

exports.editTags = async(req, res) => {
    const newInfo = req.body
    console.log('new attr : ', newInfo);
    const { rank_id, attr_id, tag_name, tag_id } = newInfo// 新增属性或修改现有属性的依据

    console.log(rank_id, attr_id, tag_name, tag_id);
    try {
        if (attr_id){// 自己的id存在，修改现有属性
            // await attrService.updateAttr(newInfo)
            // TODO: 修改标签
            if (tag_id){
                await attrService.updateTag(tag_id, tag_name);
            }else {
                await attrService.addTag(tag_id ,attr_id, tag_name);
            }
        }else if (rank_id) {// 自己的id不存在，新增属性
            const result = await attrService.addAttr(newInfo)// TODO: 返回新增后的attr_id, 便于插入标签
            await Promise.all(tags.map(async (tag) => {
                await attrService.addTag(result.insertId,  tag);
            }))
        }else {
            return res.err( 400, 'rank_id or attr_id is must for editing')
        }
        res.send({
            status: 200,
            message: 'edit attr success',
            data: newInfo
        })
    } catch (error) {
        return res.err( 500, 'editAttrs failed : ' + error)
    }
}

exports.deleteAttr = async(req, res) => {
    console.log(req.body);
    const { attrId } = req.body
    console.log('delete attr id : ', attrId);
    if (!attrId){
        return res.err(400, 'attrId is must for delete')
    }

    try {
        await attrService.deleteTag(attrId)// 先删除相应标签
        await attrService.deleteAttr(attrId)
        res.send({
            status: 200,
            message: 'delete attr success',
            data: attrId
        })
    } catch (error) {
        return res.err( 500, 'delete attr failed : ' + error)
    }
}