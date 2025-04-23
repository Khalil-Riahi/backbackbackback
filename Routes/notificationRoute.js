const express = require('express')
const notificationController = require('./../Controllers/notificationController')
const { route } = require('./subscriptionRoute')
const router = express.Router()

router
    .route('/:sender_id')
    .post(notificationController.addNotificationToAdmin)

router
    .route('/getNotifications')
    .get(notificationController.getAllNotifications)

router
    .route('/getUserNotifications/:id')
    .get(notificationController.getCurrentUserNotification)

// router
//     .route('/:id')
//     .get(notificationController.getTableById)
//     .patch(notificationController.updateTable)
//     .delete(notificationController.deleteTable)

console.log('hi2')
module.exports = router