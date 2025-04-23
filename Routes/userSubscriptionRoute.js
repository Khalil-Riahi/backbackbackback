const express = require('express')
const userSubscriptionController = require('../Controllers/userSubscriptionController')

const router = express.Router()

router
    .route('/')
    .get(userSubscriptionController.getAllUserSubscriptions)
    .post(userSubscriptionController.createUserSubscription )

router
    .route('/:id')
    .get(userSubscriptionController.getUserSubscriptionById)
    .patch(userSubscriptionController.updateUserSubscription)
    .delete(userSubscriptionController.deleteUserSubscription)
    
router
    .route('/getUsersubscriptionByIduser/:idUser')
    .get(userSubscriptionController.getSingleUserSubscriptions)
router
    .route('/available/:id')
    .get(userSubscriptionController.AvailableSubscription)
router
    .route('/currentSubscriptions/:id')
    .get(userSubscriptionController.getCurrentUserSubscription)


module.exports = router