const express=require('express')
const userRouter=express.Router()
const authController=require('./../Controllers/authController')

userRouter
    .route('/signup')
    .post(authController.signup)
    
userRouter
    .route('/login')
    .post(authController.login)
userRouter
    .route('/getUserId')
    .get(authController.getUserId)

userRouter
    .route('/Points/:id')
    .get(authController.getPoints)
    // .put(authController.addPoints)

userRouter
    .post('/payment',authController.getCheckoutSession1)
    .get('/verify/:id',authController.verifyPayment)

userRouter
    .route('/')
    .get(authController.getAllUsers)
    .patch(authController.resetAllUsersPoints)
    // .get(userNormalController.getAllUsers)

userRouter
    .route('/:id')
    .get(authController.getUserById)
    // .patch(authController.addPoints)

userRouter
    .route('/:sender_id/:user_id/:notification_id')
    .patch(authController.addPoints)

userRouter
    .route('/resetPoints/:id')
    .patch(authController.resetPoints)     
    
userRouter
    .route('/updateUser/:id')
    .patch(authController.updateUser)
module.exports=userRouter