const Table = require('./../Models/Table')
const QRCode = require('qrcode')
const fs = require('fs')
const reservation=require("./../Models/Reservation")
exports.createTable = async (req , res) => {
    try{
        console.log("hiiiiiiiiiiiiiii")

        const { numTable, Name, capacity, description , prices, type} = req.body;

        console.log("nn"+numTable)
        const url = `http://localhost:3000/login?numtable=${numTable}`
        const qr = QrGenerate(url,numTable)
        console.log("vvvvbvvvv"+qr)
        // console.log(tableType)
    
        const table ={
            numTable,
            status:"available",
            QrCode: url,
            Name,
            capacity,
            description,
            prices,
            type
            

        }

        const newTable = await Table.create(table)
        console.log("bye"+newTable)


        res.status(200).json({
            status: 'success',
            table: newTable,
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getAllTables = async (req , res) => {

    try{
        const tables = await Table.find()

        res.json({
            status: 'success',
            data: {
                tables
            }
        })
    }catch(err){
        res.json({
            status: 'fail',
            message: 'error in fetching all tables'
        })
    }
    
}

exports.getTableById = async (req , res) => {

    try{
        const table = await Table.findById(req.params.id)

        res.json({
            status: "success",
            table
        })

    }catch(err){
        res.json({
            status: 'fail',
            message: 'error in getting a table'
        })
    }
}

exports.updateTable = async (req , res) => {
    try{

        if(req.body.numTable){
            const tableToDeleteQrCode = await Table.findById(req.params.id)
            // console.log(tableToDeleteQrCode.numTable)

            fs.unlink(`./QrCodes/table-${tableToDeleteQrCode.numTable}.png` , (err) => {
                if(err){
                    // console.log(err)
                }
                // else('removed succefully')
            })

            req.body.QrCode =`http://127.0.0.1:8000/ELACO/booking/${req.body.numTable}` 
            // console.log(req.body)

            QrGenerate(req.body.QrCode)

            
        }
             res.cookie('numTable', numTable, { httpOnly: false, maxAge: 24 * 60 * 60 * 1000 });

            const table = await Table.findByIdAndUpdate(req.params.id , req.body , {
                new: true,
                runValidators: true
            })
        res.json({
            status: 'success',
            table: table
        })

    }catch(err){
        res.json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteTable = async (req , res) => {
    try{

        const tableQrCodeToDelete = await Table.findById(req.params.id)
        // const tableToDeleteQrCode = await Table.findById(req.params.id)

        // console.log(tableQrCodeToDelete.QrCode)
        // console.log(tableQrCodeToDelete.numTable)

        fs.unlink(`./QrCodes/table-${tableQrCodeToDelete.numTable}.png` , (err) => {
            if(err){
                console.log(err)
            }
            else('removed succefully')
        })

        await Table.findByIdAndDelete(req.params.id)

        res.json({
            status: 'success',
            message: 'deleted succefully'
        })
    }catch(err){
        res.json({
            status: 'fail',
            message: 'error in deleting  table'
        })
    }
}

const QrGenerate = (text,numTable) => {
    try {
        // const numTable = text.split("/")[3]
        // console.log(numTable)
        const qr =  QRCode.toFile(`./QrCodes/table-${numTable}.png`, text , (err)=> {
            if(err){
                console.log(err)
            }else{
                console.log('saved Succefully')
            }
        });
        // console.log(qr);
    } catch (err) {
        // console.log(err);
    }
};

// console.log('hi3')
// Call the function with a sample text
// QrGenerate('http://192.168.56.1:3000/');

exports.getMeetingRoom=async(req,res)=>{
    try{
        const meetingRoom = await Table.find({type:"meeting room"})
        console.log("meeting room"+meetingRoom)
        if(!meetingRoom)
           {
            res.status.json({status:"fail",
                message:'Meeting room not found'})
           }

        res.status(200).json({
            status:"success",
            meetingRoom
        })
    }catch(error){
        res.status(400).json({
            status:"fail",
            message:error
        })
    }
}

exports.getOffice=async(req,res)=>{
    try{
        const offices=await Table.find({type:"office"})
        if(!offices){
            res.status.json({
                status:"fail",
                message:'Office not found'
            })
        }
        res.status(200).json({
            status:"success",
            offices
        })

    }catch(error){
        res.status(400).json({
            status:"fail",
            message:error
        })

    }
}


exports.getReservations = async (req, res) => {
    try {
      const reservations1 = await reservation.find({
        date: new Date(date),
        numTable: 34,
      }).select('check_in check_out');
    console.log("reservations"+reservations1)
  
      res.status(200).json({
        success: true,
        data: reservations1
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch reservations",
        error: error
      });
    }
  };