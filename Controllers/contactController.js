const Contact=require('./../Models/Contact')


exports.addContact=async(req,res)=>{
    try{
        const newContact=await Contact.create(req.body)
        res.status(201).json({
            status:"success",
            newContact

        })


    }catch(error){
        res.status(404).json({
            status:'fail',
            error
        })

    }
}
