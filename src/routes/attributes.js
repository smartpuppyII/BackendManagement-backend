const express = require('express')
const attrRoute = express.Router()
const attrController = require('../controller/attr')

attrRoute.get('/getTags', attrController.getTags)

attrRoute.post('/editTags', attrController.editTags)

module.exports = attrRoute