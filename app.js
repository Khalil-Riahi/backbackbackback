
const express = require('express');
const User=require('./Models/User')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const session = require('express-session')
app.use(cookieParser());
const passport = require('passport')
app.use(passport.initialize())
const {setupPassport} = require('./Controllers/googleController')
const multer=require('multer')
const path=require('path')
app.use(express.static('public'))
app.use(cors(
  {
    // origin: ['http://localhost:3000','http://localhost:3001' , 'http://localhost:55124' , 'http://192.168.1.34'],
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:52126',
      // 'http://192.168.1.34',
      // 'http://192.168.1.34:3000',
      // 'http://192.168.1.34:3001',
      // 'http://192.168.1.34:44436',
      // 'http://0.0.0.0'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
  }
));
app.use(
  session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    
  })
)



const storage = multer.diskStorage({
  destination: (req , file , cb) => {
    cb(null , 'public/images')
  },
  filename: (req , file , cb) => {
    cb(null , file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
  
})

const upload = multer({
  storage: storage
})

app.patch('/uplaod/:id', upload.single('file') , async (req , res) =>{
  console.log(req.file)
  try{
    const user = await User.findByIdAndUpdate(req.params.id , {photo: req.file.filename} , {
      new: true,
      runValidators: true
    })
    // User
    res.json({
      status: "success",
      userImage : user.photo
    })

  }catch(err){
    res.status(450).json({
      status: "fail",
      message: err
    })
  }
})

app.use(express.json())
setupPassport(passport)
const subscriptionRouter = require('./Routes/subscriptionRoute');
const userRouter = require('./Routes/userRoute');
const userSubscription = require('./Routes/userSubscriptionRoute');
const bookingRouter = require('./Routes/tablePaymentRouter');
const tableRouter = require('./Routes/tableRoute');
const googleRouter =require("./Routes/googleRoute")
const contact=require("./Routes/contactRoute")
const notificationRouter = require('./Routes/notificationRoute')

app.use('/' , googleRouter)
app.use('/ELACO/contact',contact)
app.use('/ELACO/subcription', subscriptionRouter);
app.use('/ELACO', userRouter);
app.use('/ELACO/userSubscription', userSubscription);
app.use('/ELACO/booking', bookingRouter);
app.use('/ELACO/table', tableRouter);
app.use('/ELACO/notification' , notificationRouter)

module.exports = app;