const express=require('express')
const fs=require('fs')
const TablePaiement=require('../Models/Reservation')
const Table=require('./../Models/Table')
const moment = require('moment'); 
const User=require('./../Models/User')

// exports.addBooking = async (req, res) => {
//     try {
                 
       
//         const table = await Table.findOne({ numTable: req.body.numTable ,status:"available"});
//         if(!table){
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'Table is already reserved'
//             });
//         }
//         const t = await Table.findOneAndUpdate(
//             { numTable: req.body.numTable }, 
//             { status: "occupied" }, 
//             { new: true } 
//         );
//         const tablepaiement = await TablePaiement.create({
//             check_in: req.body.check_in,
//             check_out: req.body.check_out,
//             date: new Date(),
//             id_user: req.body.id_user,
//             numTable: req.body.numTable,
//             price: req.body.price,
//             paymentMethod:req.body.paymentMethod
//         });

//         console.log(tablepaiement);

//         res.status(201).json({
//             status: 'success',
//             message: 'Booking added successfully',
//             table: t,
//             booking: tablepaiement
//         });

//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message || 'An error occurred'
//         });
//     }
// };
exports.getall=async(req,res)=>{
    try{
        const tablepaiements= await TablePaiement.find()
        res.status(200).json({
            status:'success',
            data:tablepaiements
        })

    }catch(error){
        res.status(404).json(
            {
                status:'error',
                message:"error uuuu "
                })
    }
}
// 
exports.addBooking = async (req, res) => {
    try {
        console.log(req.body)
        const { numTable, check_in, check_out, id_user, price, paymentMethod, date } = req.body;

        if (
            numTable === undefined || check_in === undefined || check_out === undefined ||
            id_user === undefined || price === undefined || paymentMethod === undefined || date === undefined
                 )         {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required booking information'
            });
        }
        // if(paymentMethod=="points"){
        //     const user = await User.findByIdAndUpdate( req.params.id , req.body.points , {
        //         new: true,
        //         runValidators: true
        //     })

        // }
        if (paymentMethod == "points") {
            const user = await User.findByIdAndUpdate(
                req.params.id_user,
                { points: req.body.points },
                {
                    new: true,
                    runValidators: true
                }
            );
        }
        // Normalize the booking date to only compare by date part
        const bookingDate = new Date(date);
        const startOfDay = new Date(bookingDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(bookingDate.setHours(23, 59, 59, 999));

        // Check for existing reservation for the same table and same date with time overlap
        const existingReservation = await TablePaiement.findOne({
            numTable,
            date: { $gte: startOfDay, $lt: endOfDay },
            $or: [
                {
                    check_in: { $lt: check_out },
                    check_out: { $gt: check_in }
                }
            ]
        });

        if (existingReservation) {
            return res.status(409).json({
                status: 'fail',
                message: 'Table is already reserved on this date and time'
            });
        }

        // Optional: you can skip this check, or just ensure the table exists
        const table = await Table.findOne({ numTable });

        if (!table) {
            return res.status(404).json({
                status: 'fail',
                message: 'Table not found'
            });
        }

        // Create the booking
        const booking = await TablePaiement.create({
            check_in, // keep as string "HH:mm"
            check_out,
            date: new Date(date),
            id_user,
            numTable,
            price,
            paymentMethod
        });

        // Optionally mark the table as occupied if you want
        await Table.findOneAndUpdate(
            { numTable },
            { status: 'occupied' }
        );

        res.status(201).json({
            status: 'success',
            message: 'Booking added successfully',
            booking
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            status: 'error',
            message: error
        });
    }
};


exports.getCheckoutSession = async(req , res) => {
    try{
        console.log("nnn")
        const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment"
        const payload =  {
            receiverWalletId: process.env.WALLET_ID,
            amount : req.body.amount,
            description: req.body.description,
            acceptedPaymentMethods: ["e-DINAR"],
            successUrl: `http://localhost:3000/payment?start_time=${req.query.start_time}&end_time=${req.query.end_time}&numTable=${req.query.numTable}&date=${req.query.date}`,
            failUrl: `http://localhost:3000/payment?start_time=${req.query.start_time}&end_time=${req.query.end_time}&numTable=${req.query.numTable}`,
    

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
exports.verify = async (req , res) => {

    try{
        const id_payment = req.params.id
        // const url = https://api.sandbox.konnect.network/api/v2/payments/${id_payment}

        const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`)

        const resData = await response.json()

        res.json({
            // status: 'success', 
            resData
        })
    }catch(err){
        res.json(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getHistory=async(req,res)=>{
    try{
        const history= await TablePaiement.find({id_user:req.params.id})

        if(!hist){
            res.json(404).json({
                status:'fail',
                message:'no booking Histroy find'
            })
        }
        res.status(200).json({
            status:'success',
            history:history
        })
    }catch(error){
        res.status(400).json({
            status:'fail',
            message:error
        })

    }

}
exports.getHistory = async (req, res) => {
    try {
        const history = await TablePaiement.find({ id_user: req.params.id });
        console.log("hhhhh"+history)
        console.log("ffffffff")
        if (!history || history.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No payment history found for this user'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                history: history
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message // It's better to send error.message rather than the whole error object
        });
    }
};

// exports.getReservations = async (req, res) => {
//     try {
//       const reservations1 = await reservation.find({
//         date: new Date(date),
//         numTable: 34,
//       }).select('check_in check_out');
//     console.log("reservations"+reservations1)
  
//       res.status(200).json({
//         success: true,
//         data: reservations1
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch reservations",
//         error: error
//       });
//     }
//   };
exports.getReservations = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const reservations1 = await TablePaiement.find({
            numTable: 34,
            date: { $gte: today } 
        })
        .select('check_in check_out date')
        .sort({ date: 1, check_in: 1 });


        const reservations2 = await TablePaiement.find({
            numTable: 33,
            date: { $gte: today } 
        })
        .select('check_in check_out date')
        .sort({ date: 1, check_in: 1 }); 

        console.log(`Reservations for table 34 from ${today.toISOString()}:`, reservations1);

        res.status(200).json({
            success: true,
            data:[
                reservations1,
                reservations2
            ]
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reservations",
            error: error.message
        });
    }
};
exports.getReservationsprivateOffice= async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const private = await TablePaiement.find({
            numTable: 31,
            date: { $gte: today } 
        })
        .select('check_in check_out date')
        .sort({ date: 1, check_in: 1 });


        const premuim = await TablePaiement.find({
            numTable: 32,
            date: { $gte: today } 
        })
        .select('check_in check_out date')
        .sort({ date: 1, check_in: 1 }); 


        res.status(200).json({
            success: true,
            data:[
                private,
                premuim
            ]
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reservations",
            error: error.message
        });
    }
};