const express = require('express')
const attrRoute = express.Router()
const attrController = require('../controller/attr')

attrRoute.get('/getTags', attrController.getTags)

attrRoute.post('/editTags', attrController.editTags)

attrRoute.post('/deleteAttr', attrController.deleteAttr)

module.exports = attrRoute