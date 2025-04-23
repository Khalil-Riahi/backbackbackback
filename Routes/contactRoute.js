const express = require('express')
const contactController = require('./../Controllers/contactController')
const router = express.Router()

router
    .route('/')
    .post(contactController.addContact)

module.exports=router
