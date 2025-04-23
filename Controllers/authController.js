const User= require('./../Models/User')
const jwt=require('jsonwebtoken')
const AppError=require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync');
const Notification = require('./../Models/Notification')

const signToken =id=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRE_IN})

}
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires :new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*25*60*60*1000 ),
        httpOnly:true ,
    }
    if(process.env.NODE_ENV==='production'){
      cookieOptions.secure=true
      }
    res.status(statusCode).cookie('jwt',token,cookieOptions).json({
        status: 'success',
        data: {
            user
        }
    })
}

exports.signup=catchAsync(async(req,res)=>{
    const newUser=await User.create(req.body)
    createSendToken(newUser,201,res)
    })

exports.login = async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide an email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new AppError('Invalid email', 401));
    }
    const correct = await user.correctPassword(password, user.password);
    if (!correct) {
        return next(new AppError('Invalid password', 401));
    }
    createSendToken(user,200,res)


};

// exports.protect = catchAsync(async (req, res, next) => {
//     let token
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[1];
//       console.log("eee"+token)
//     }
  
//     if (!token) {
//       return next(
//         new AppError('You are not logged in! Please log in to get access.', 401)
//       );
//     }
//     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//       return next(
//         new AppError(
//           'The user belonging to this token does no longer exist.',
//           401
//         )
//       );
//     }
//     if (currentUser.changedPasswordAfter(decoded.iat)) {
//       return next(
//         new AppError('User recently changed password! Please log in again.', 401)
//       );
//     }
//       req.user = currentUser;
//     next();
//   });



exports.getUserId = async (req, res) => {
  try {
      const token = req.cookies.jwt;
      console.log("token"+token)

      if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
      
      console.log('Received Token:', token); 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); 

      const userId = decoded.id;
      console.log("user id is "+userId)
      res.status(200).json({ id_user: userId });
  } catch (err) {
      console.error('Token Verification Error:', err)
      res.status(401).json({ message: 'Invalid token' });
  }
};

exports.getPoints=async(req,res)=>{
  try {
    console.log("ffffff")
  const points= await User.findById(req.params.id)
  .select('points')
  console.log("points"+points)

  if(!points){
     res.status(404).json({ message: 'User not found' })
  }

  res.status(200).json({
    status:"Success",
    points:points.points
  })
  }catch(error){
    res.status(401).json({
      status:"Error",
      message:error.message
    
    })

  }
}
// exports.verify = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// exports.addPoints=async(req,res)=>{
//   try{
//     const points=req.body
//     const user=await User.findByIdAndUpdate(req.params.id,{$inc:{points:points}},{new
//       :true})
//     if(!user){
//       res.status(404).json({
//         status:"fail",
//         message: 'User not found' })
//     }
//     res.status(201).json({
//       status:"Success",
//     })
//   }catch(error){
//     res.status(401).json({
//       status:"Error",
//       message:error.message
//       })

//   }

// }
exports.getCheckoutSession1 = async(req , res) => {
  try{
      const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment"
      const payload =  {
          receiverWalletId: process.env.WALLET_ID,
          amount : req.body.amount,
          description: req.body.description,
          acceptedPaymentMethods: ["e-DINAR"],
          successUrl: `http://localhost:3000/points/verify?status=success&userId=${req.query.userId}&points=${req.query.points}`,
          failUrl: `http://localhost:3000/points/verify?status=failed`,

      }

      const response = await fetch(url , {
          method: "POST",
          body: JSON.stringify(payload),
          headers:{
              'Content-Type': 'application/json',
              'x-api-key': process.env.API_KEY_KONNECT
          }
      })

      const resData = await response.json()

      res.json({
          status: 'success',
          result: resData
      })
  }catch(err){
      res.status(400).json({
          status: 'fail',
          message: err
      })
  }
}
exports.verifyPayment = async (req, res) => {
  try {
    const { userId, points } = req.query;
    const  paymentId=req.params.id
    console.log("ouhhhhh id user"+userId+"points"+points+"payid"+paymentId)
    // Verify payment with Konnect
    const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${paymentId}`)

    const resData = await response.json()
    // res.status(200).json({
    //   resData
    // })
    if (resData.payment.transactions[0].status == "success") {
      // Update user points
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { points: points } },
        { new: true }
      );
      console.log("user:"+user)

      
      if (!user) {
        return res.status(404).json({ status: "fail", message: 'User not found' });
      }
      
      return res.json({ status: 'success', user });
    } else {
      return res.status(400).json({ status: 'fail', message: 'Payment not completed' });
    }
  
  } catch(err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};




// exports.addPoints = async (req , res) => {
//   try{
      
//       const getOldPointOfUser = await User.findById(req.params.id).select('points')

//       console.log('nour')
//       if(!req.body.points){
//           req.body.points = 0
//       }
//       const newPoints = parseInt(req.body.points) + parseInt(getOldPointOfUser.points)

//       const user = await User.findByIdAndUpdate(req.params.id , {points: newPoints} , {
//           new: true,
//           runValidators: true
//       })

//       res.json({
//           status: 'success',
//           userPoints: user.points
//       })
//   }catch(err){
//       res.status(400).json({
//           status: 'fail',
//           message: err
//       })
//   }
// }

// exports.addPoints = async (req, res) => {
//     try {
//       console.log("sender_id:", req.params.sender_id);
//       console.log("receiver_id:", req.params.user_id);
  
//       const not = {
//         sender_id: req.params.user_id,
//         user_id: req.params.sender_id,
//         title: "Adding Points",
//         content: `The admin accepts your request to add ${req.body.points} points to your account.`,
//         status: 'treated',
//       };
  
//       const notification = await Notification.create(not);
//       console.log(notification)

//       const notificationToUpdateItsStatus = Notification.findByIdAndUpdate(req.params.notification_id , {status: 'treated'} , {
//         new: true,
//         runValidators: true
//       })

//       console.log(notificationToUpdateItsStatus)
  
//       const getOldPointOfUser = await User.findById(req.params.sender_id).select('points');
  
//       if (!req.body.points || isNaN(req.body.points)) {
//         req.body.points = 0;
//       }
  
//       const newPoints = parseInt(req.body.points) + parseInt(getOldPointOfUser.points || 0);
  
//       const user = await User.findByIdAndUpdate(
//         req.params.sender_id,
//         { points: newPoints },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
  
//       res.json({
//         status: 'success',
//         userPoints: user.points,
//       });
//     } catch (err) {
//       res.status(400).json({
//         status: 'fail',
//         message: err.message || 'Something went wrong',
//       });
//     }
//   };

exports.addPoints = async (req, res) => {
    try {
      console.log("sender_id:", req.params.sender_id);
      console.log("receiver_id:", req.params.user_id);
  
      const not = {
        sender_id: req.params.user_id,
        user_id: req.params.sender_id,
        title: "Adding Points",
        content: `The admin accepts your request to add ${req.body.points} points to your account.`,
        status: 'treated',
      };

  
      const notification = await Notification.create(not);
      console.log(notification)
      console.log('nmnmm')
      

      const notificationToUpdateItsStatus = await Notification.findByIdAndUpdate(req.params.notification_id , {status: 'treated'} , {
        new: true,
        runValidators: true
      })

      console.log(notificationToUpdateItsStatus)
  
      const getOldPointOfUser = await User.findById(req.params.sender_id).select('points');
  
      if (!req.body.points || isNaN(req.body.points)) {
        req.body.points = 0;
      }
  
      const newPoints = parseInt(req.body.points) + parseInt(getOldPointOfUser.points || 0);
  
      const user = await User.findByIdAndUpdate(
        req.params.sender_id,
        { points: newPoints },
        {
          new: true,
          runValidators: true,
        }
      );
  
      res.json({
        status: 'success',
        userPoints: user.points,
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message || 'Something went wrong',
      });
    }
  };

exports.resetPoints = async(req , res) => {
  try{
      const updatedUser = await User.findByIdAndUpdate(req.params.id , {points: 0} , {
          new: true,
          runValidators: true
      })
      res.json({
          status: 'success',
          updatedUser
      })
      
  }catch(err){
      res.status(400).json({
          status: 'fail',
          message: err
      })
  }
}

exports.resetPoints = async(req , res) => {
  try{
      const updatedUser = await User.findByIdAndUpdate(req.params.id , {points: 0} , {
          new: true,
          runValidators: true
      })
      res.json({
          status: 'success',
          updatedUser
      })
      
  }catch(err){
      res.status(400).json({
          status: 'fail',
          message: err
      })
  }
}
exports.resetAllUsersPoints = async (req , res) => {
  try{
      const updatedUsers = await User.updateMany({} , {$set: {points: 0}} , {
          new: true,
          runValidators: true
      })
      res.status(400).json({
          status: 'success',
          updatedUsers
      })
  }catch(err){
      res.status(400).json({
          status: 'fail',
          message: err
      })
  }
}


exports.getUserById = async (req , res) => {
  try{
      const user = await User.findById(req.params.id)
      res.json({
          status: "success",
          user
      })
  }catch(err){
      res.status(400).json({
          status: "fail",
          message: err
      })
  }
  
}

exports.updateUser = async (req , res) => {
  try{
      const updatedUser = await User.findByIdAndUpdate(req.params.id , req.body , {
          new: true,
          runValidators: true
      })

      console.log('miao')
      console.log(updatedUser)
      res.json({
          status: 'success',
          updatedUser
      })
  }catch(err){
      res.status(400).json({
          status: "fail",
          message: err
      })
  }   
}

exports.getAllUsers = async (req , res) => {

  try{
      const users = await User.find().select('firstName lastName email phone , points')

      res.json({
          status: 'success',
          results: users.length,
          data: {
              users
          }
      })
  }catch(err){
      res.status(400).json({
          status: 'fail',
          message: 'error in fetching users'
      })
  }
}