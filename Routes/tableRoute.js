const express = require('express')
const tableController = require('./../Controllers/tableController')
const router = express.Router()

router
    .route('/nn')
    .get(tableController.getAllTables)
    .post(tableController.createTable)

router.get('/meetingRoom', tableController.getMeetingRoom);
router.get('/offices',tableController.getOffice)

router
    .route('/:id')
    .get(tableController.getTableById)
    .patch(tableController.updateTable)
    .delete(tableController.deleteTable)


console.log('hi2')
module.exports = router