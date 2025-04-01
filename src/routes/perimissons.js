const express = require('express')
const permissionRoute = express.Router()
const permissionController = require('../controller/permission')

permissionRoute.get('/getAllPermissions', permissionController.getAllPermissions)

permissionRoute.get('/getPermission', permissionController.getPermission)

permissionRoute.post('/updatePermisssion', permissionController.updatePermission)

module.exports = permissionRoute