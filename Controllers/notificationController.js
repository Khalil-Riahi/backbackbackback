const Notification = require('./../Models/Notification')
const User = require('./../Models/User')


exports.addNotification = async (req , res) => {
    try{
        
        const notification = await Notification.create(req.body)
    
        res.json({
            status: 'success',
            notification
        })
  
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.addNotificationToAdmin = async (req , res) => {
    try{
        
        const admins = await User.find().where('role').equals('admin')

        if (admins.length === 0 ){
            console.log('No Admins Found')
            return
        }

        const notifications = admins.map(admin => ({
            title: req.body.title,
            content: req.body.content,
            points: req.body.points,
            user_id: admin._id,
            sender_id: req.params.sender_id
        }))

        console.log(notifications)

        await Notification.insertMany(notifications)
        
        res.json({
            status: 'success',
            message: "A request sended succefully to admin"
        })
  
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getAllNotifications = async (req , res) => {
    try{
        console.log('nono')
        const notifications = await Notification.find()

        res.json({
            status: 'success',
            results: notifications.length,
            notifications
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getCurrentUserNotification = async (req , res) => {
    try{
        const notifications = await Notification.find().where('user_id').equals(req.params.id).sort({sentDate: -1 , sentTime: -1}).populate('sender_id')
        res.json({
           status: 'success',
           result: notifications.length,
           notifications
        })
    }catch(err){

        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
    
}