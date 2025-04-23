const express=require('express')
const fs=require('fs')
const Subscription = require('./../Models/Subscription')
const UserSubscription=require('./../Models/userSubscription')
const { fail } = require('assert')

exports.getAllSubscription=async(req,res)=>{
    try{
        const subscriptions=await Subscription.find()
        res.status(200).json({
            status:'success',
            data:{
                subscriptions:subscriptions
            }
        })
    }catch{
        res.status(404).json({
            status:'fail',
            data:{
                message:'No subscription found'
            }
        })
    }
}
exports.updateSubecription=async(req,res)=>{
    try{
        const id=req.params.id
        const updatedSubscription=await Subscription.findByIdAndUpdate(id,req.body,{new:true,
            runValidators:true})
        
        res.status(200).json({
            status:'success',
            data:{
                updatedSubscription:updatedSubscription
            }
        })

    }catch{
        res.status(404).json({
            status:'fail',
            data:{
                message:'No subscription found'
            }
        })
    }
}
exports.deleteSubscription=async(req,res)=>{
    try{
        const id=req.params.id
        await Subscription.findByIdAndDelete(id)
        res.status(204).json({
            status:'success',
            data:{
                message:'Subscription deleted successfully'
        }})

    }catch{
        res.status(404).json({
            status:fail,
            data:{
                message:'No subscription found'
            }
     })
    }
}
exports.addSubscription=async (req,res)=>{
    try{
        const subscription= await Subscription.create(req.body)
        res.status(201).json({  
            status:'success',
            data:{
                subscription:subscription
                }

        })

    }catch(error){
        res.status(400).json({
            "status": "failed",
            "Message": error
        })
    }
}
exports.getSubscriptionById=async(req,res)=>{
    try{
        const id=req.params.id
        const subscription=await Subscription.findById(id)
        res.status(204).json({
            status:'success',
            data:{
                subscription:subscription}})

    }catch{
        res.status(404).json({
            status:fail,
            data:{
                message:'No subscription found'
            }
     })
    }
}
const axios = require('axios')
// exports.getCheckoutSession = async(req , res) => {
//     try{
//         const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment"

//         const payload =  {
//             receiverWalletId: process.env.WALLET_ID,
//             amount : req.body.amount,
//             description: req.body.description,
//             acceptedPaymentMethods: ["e-DINAR"],
//             successUrl: `http://localhost:3000/subPay?status=success&subId=${req.body.subId}`,
//             failUrl: `http://localhost:3000/subPay?status=failed`,
//         }

//         const response = await fetch(url , {
//             method: "POST",
//             body: JSON.stringify(payload),
//             headers:{
//                 'Content-Type': 'application/json',
//                 'x-api-key': process.env.API_KEY_KONNECT
//             }
//         })

//         const resData = await response.json()

//         res.status(200).json({
//             status: 'success',
//             result: resData
//         })
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }

// exports.getCheckoutSession = async (req, res) => {
//     try {
//       const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment";
  
//       const start_date = new Date(req.body.start_date);
//       let end_date = new Date(start_date);
  
//       const subscription = await Subscription.findById(req.body.subId);
  
//       if (!subscription) {
//         return res.status(404).json({ status: "fail", message: "Subscription not found" });
//       }
  
//       if (subscription.subscriptionType === "daily") {
//         end_date.setDate(end_date.getDate() + 1);
//       } else if (subscription.subscriptionType === "weekly") {
//         end_date.setDate(end_date.getDate() + 7);
//       } else if (subscription.subscriptionType.startsWith("monthly")) {
//         end_date.setMonth(end_date.getMonth() + 1);
//       }
  
//       if (subscription.table_id) {
//         // const allConflictedDate = await UserSubscription.find({
//         //   start_date: { $gte: start_date },
//         //   // end_date: { gte: start_date }
//         // }).populate('id_subscription');

//         const allConflictedDate = await UserSubscription.find({
//             $or: [
//               {
//                 start_date: { $lte: end_date },
//                 end_date: { $gte: start_date }
//               }
//             ]
//           }).populate('id_subscription');
  
//         const filtered = allConflictedDate.filter(all =>
//           all.id_subscription &&
//           all.id_subscription.table_id?.toString() === subscription.table_id?.toString()
//         );
  
//         console.log(filtered)
  
//         // Only calculate if there's any conflict
//         if (filtered.length > 0) {
//           const availableAfterObj = filtered.reduce((latest, current) => {
//             return new Date(current.end_date) > new Date(latest.end_date) ? current : latest;
//           });
  
//           const availbleDate = availableAfterObj.end_date;
  
          
  
//           return res.status(210).json({
//             status: 'success',
//             message: `You can only reserve after the ${new Intl.DateTimeFormat('en-CA').format(availbleDate)}`
//           });
//         }
//       }
  
//       const payload = {
//         receiverWalletId: process.env.WALLET_ID,
//         amount: req.body.amount,
//         description: req.body.description,
//         acceptedPaymentMethods: ["e-DINAR"],
//         successUrl: `http://localhost:3000/subPay?status=success&subId=${req.body.subId}&start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`,
//         failUrl: `http://localhost:3000/subPay?status=failed`,
//       };
  
//       const response = await fetch(url, {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": process.env.API_KEY_KONNECT,
//         },
//       });
  
//       const resData = await response.json();
  
//       return res.status(200).json({
//         status: "success",
//         result: resData,
//       });
//     } catch (err) {
//       console.error(err);
//       return res.status(400).json({
//         status: "fail",
//         message: err.message || "Something went wrong",
//       });
//     }
//   };

// exports.getCheckoutSession = async (req, res) => {
//   try {
//     const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment";

//     const start_date = new Date(req.body.start_date);
//     let end_date = new Date(start_date);

//     const subscription = await Subscription.findById(req.body.subId);

//     if (!subscription) {
//       return res.status(404).json({ status: "fail", message: "Subscription not found" });
//     }

//     if (subscription.subscriptionType === "daily") {
//       end_date.setDate(end_date.getDate() + 1);
//     } else if (subscription.subscriptionType === "weekly") {
//       end_date.setDate(end_date.getDate() + 7);
//     } else if (subscription.subscriptionType.startsWith("monthly")) {
//       end_date.setMonth(end_date.getMonth() + 1);
//     }

//     if (subscription.table_id) {
//       const allConflictedDate = await UserSubscription.find({
//         start_date: { $gte: start_date },
//         // end_date: { gte: start_date }
//       }).populate('id_subscription');

//       const filtered = allConflictedDate.filter(all =>
//         all.id_subscription &&
//         all.id_subscription.table_id?.toString() === subscription.table_id?.toString()
//       );

//       console.log(filtered)

//       // Only calculate if there's any conflict
//       if (filtered.length > 0) {
//         const availableAfterObj = filtered.reduce((latest, current) => {
//           return new Date(current.end_date) > new Date(latest.end_date) ? current : latest;
//         });

//         const availbleDate = availableAfterObj.end_date;

        

//         return res.status(210).json({
//           status: 'success',
//           message: `You can only reserve after the ${new Intl.DateTimeFormat('en-CA').format(availbleDate)}`
//         });
//       }
//     }

//     const payload = {
//       receiverWalletId: process.env.WALLET_ID,
//       amount: req.body.amount,
//       description: req.body.description,
//       acceptedPaymentMethods: ["e-DINAR"],
//       successUrl: `http://localhost:3000/subPay?status=success&subId=${req.body.subId}&start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`,
//       failUrl: `http://localhost:3000/subPay?status=failed`,
//     };

//     const response = await fetch(url, {
//       method: "POST",
//       body: JSON.stringify(payload),
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.API_KEY_KONNECT,
//       },
//     });

//     const resData = await response.json();

//     return res.status(200).json({
//       status: "success",
//       result: resData,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(400).json({
//       status: "fail",
//       message: err.message || "Something went wrong",
//     });
//   }
// };

exports.getCheckoutSession = async (req, res) => {
  try {
    const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment";

    // parse start_date and compute end_date based on the plan
    const start_date = new Date(req.body.start_date);
    let end_date = new Date(start_date);

    const subscription = await Subscription.findById(req.body.subId);
    if (!subscription) {
      return res.status(404).json({ status: "fail", message: "Subscription not found" });
    }

    if (subscription.subscriptionType === "daily") {
      end_date.setDate(end_date.getDate() + 1);
    } else if (subscription.subscriptionType === "weekly") {
      end_date.setDate(end_date.getDate() + 7);
    } else if (subscription.subscriptionType.startsWith("monthly")) {
      end_date.setMonth(end_date.getMonth() + 1);
    }

    // conflict check for same table_id
    if (subscription.table_id) {
      // find *any* existing booking that overlaps [start_date, end_date]
      const potentiallyConflicted = await UserSubscription.find({
        start_date: { $lte: end_date },
        end_date:   { $gte: start_date }
      }).populate('id_subscription');

      // filter to the same table
      const conflicts = potentiallyConflicted.filter(us =>
        us.id_subscription &&
        us.id_subscription.table_id?.toString() === subscription.table_id.toString()
      );

      if (conflicts.length > 0) {
        // pick the one that ends the latest
        const lastEnding = conflicts.reduce((prev, cur) =>
          new Date(cur.end_date) > new Date(prev.end_date) ? cur : prev
        );
        const nextAvailable = new Date(lastEnding.end_date);
        // if you want to require one extra day gap:
        // nextAvailable.setDate(nextAvailable.getDate() + 1);

        return res.status(210).json({
          status: 'success',
          message: `You can only reserve after ${new Intl.DateTimeFormat('en-CA').format(nextAvailable)}`
        });
      }
    }

    // build payment payload
    const payload = {
      receiverWalletId: process.env.WALLET_ID,
      amount: req.body.amount,
      description: req.body.description,
      acceptedPaymentMethods: ["e-DINAR"],
      successUrl: `http://localhost:3000/subPay?status=success&subId=${req.body.subId}` +
                  `&start_date=${start_date.toISOString()}` +
                  `&end_date=${end_date.toISOString()}`,
      failUrl: `http://localhost:3000/subPay?status=failed`
    };

    // call Konnect
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY_KONNECT
      },
      body: JSON.stringify(payload)
    });
    const resData = await response.json();

    return res.status(200).json({
      status: "success",
      result: resData
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({
      status: "fail",
      message: err.message || "Something went wrong"
    });
  }
};

// exports.verify = async (req , res) => {

//     try{
//         console.log('jjjj')
//         const id_payment = req.params.paymentId
//         console.log(",,"+id_payment)
//         const subId = req.query.subId
//         const idUser = req.query.idUser
//         const start_date = Date.now()
//         // let end_date
//         console.log('subId= ' + subId + 'idUser= ' + idUser)

//         // const url = https://api.sandbox.konnect.network/api/v2/payments/${id_payment}

//         const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`)

//         const resData = await response.json()
//         // console.log("nnn"+resData.transactions[0])
//         console.log('woooooohhh '+resData.payment.transactions[0].status)
//         console.log("hello" + resData.payment.transactions[0].status)
//         if(resData.payment.transactions[0].status === "success"){

//             const subscription = await Subscription.findById(subId)
//             console.log("subscriptio \n")

//             console.log(subscription)

//         const end_date = new Date()

//         if (subscription.subscriptionType === "daily") {
//             // let end_date = new Date();
//             end_date.setDate(end_date.getDate() + 1);
//             console.log("end-date: " + end_date.toISOString());
//         }
//         if(subscription.subscriptionType=="weekly"){
//             end_date.setDate(end_date.getDay()+7);
//             console.log("end-date"+end_date)
//         }
//         if(subscription.subscriptionType.startsWith("monthly")){
//             end_date.setMonth(end_date.getMonth() + 1);
//             console.log("end date"+end_date)
//         } 
              

//             console.log('end_date = ' + end_date.toISOString())

//             const userSub = {
//                 id_user: idUser,
//                 id_subscription: subId,
//                 start_date: start_date,
//                 end_date: end_date,
//             }

//             const newUserSub = await UserSubscription.create(userSub)

//             res.status(200).json({
//                 status: 'success',
//                 newUserSub         
//             })
//         }
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }


// exports.verify = async (req, res) => {
//     try {
//       const id_payment = req.params.paymentId;
//       const subId = req.query.subId;
//       const idUser = req.query.idUser;
//       const start_date1 = req.query.start_date; // this is a string
//       const end_date1 = req.query.end_date;     // this is a string
  
//       console.log("Query params:", req.query);
  
//       const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`);
//       const resData = await response.json();
  
//       if (resData.payment.transactions[0].status === "success") {
//         const subscription = await Subscription.findById(subId);
//         let computedEndDate = new Date(start_date1); // convert string to Date
  
//         if (subscription.subscriptionType === "daily") {
//           computedEndDate.setDate(computedEndDate.getDate() + 1);
//         } else if (subscription.subscriptionType === "weekly") {
//           computedEndDate.setDate(computedEndDate.getDate() + 7);
//         } else if (subscription.subscriptionType.startsWith("monthly")) {
//           computedEndDate.setMonth(computedEndDate.getMonth() + 1);
//         }
  
//         const userSub = {
//           id_user: idUser,
//           id_subscription: subId,
//           start_date: new Date(start_date1),
//           end_date: computedEndDate,
//         };
  
//         const newUserSub = await UserSubscription.create(userSub);
  
//         res.status(200).json({
//           status: 'success',
//           newUserSub
//         });
//       }
//     }catch (err) {
//       console.error("Error in /verify:", err);
//       res.status(400).json({
//         status: 'fail',
//         message: err.message || err
//       });
//     }
//   };

exports.verify = async (req, res) => {
  try {
    const id_payment = req.params.paymentId;
    const subId = req.query.subId;
    const idUser = req.query.idUser;
    const start_date1 = req.query.start_date; 
    const end_date1 = req.query.end_date;   


    console.log("dateeeeeeeeeeeee:", req.query.end_date);

    const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`);
    const resData = await response.json();

    if (resData.payment.transactions[0].status === "success") {
      const subscription = await Subscription.findById(subId);
      let computedEndDate = new Date(start_date1); // convert string to Date

      if (subscription.subscriptionType === "daily") {
        computedEndDate.setDate(computedEndDate.getDate() + 1);
      } else if (subscription.subscriptionType === "weekly") {
        computedEndDate.setDate(computedEndDate.getDate() + 7);
      } else if (subscription.subscriptionType.startsWith("monthly")) {
        computedEndDate.setMonth(computedEndDate.getMonth() + 1);
      }

      const userSub = {
        id_user: idUser,
        id_subscription: subId,
        start_date: new Date(start_date1),
        end_date: computedEndDate,
      };

      const newUserSub = await UserSubscription.create(userSub);

      res.status(200).json({
        status: 'success',
        newUserSub
      });
    }
  }catch (err) {
    console.error("Error in /verify:", err);
    res.status(400).json({
      status: 'fail',
      message: err.message || err
    });
  }
};

exports.getSubscriptionByType = async (req , res) => {
    try{
        // const subscriptions = await Subscription.find().where('roomType').equals(req.params.roomType)
        const subscriptions = await Subscription.find().where('roomType').regex(new RegExp(`^${req.params.roomType}`, 'i'));

        res.json({
            status: 'success',
            results: subscriptions.length,
            subscriptions
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getMe = async (req, res) => {
    try {
  
      let subscriptions
      // console.log('lkl')
  
      if(req.params.roomType === 'openspace'){
        subscriptions = await Subscription.find({
          table_id: {$exists: false}
        })
        res.json({
          status: 'success',
          results: subscriptions.length,
          subscriptions: subscriptions
        })
      }else{
        const roomType = req.params.roomType
        subscriptions = await Subscription.find()
          .populate({
            path: 'table_id',
            match: { type: roomType }
          });
    
        // Filter to include only subscriptions that have a populated meeting room
        const filtered = subscriptions.filter(sub => sub.table_id);
    
        res.json({ 
          status: 'success',
          result: filtered.length,
          subscriptions: filtered 
        });
      }
  
      
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message:err
      });
    }
  };