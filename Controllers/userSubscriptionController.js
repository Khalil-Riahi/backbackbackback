const UserSubscription = require('./../Models/userSubscription')
const Subscription =require('./../Models/Subscription')
const User = require('./../Models/User')
exports.getAllUserSubscriptions = async (req , res) => {

    try{
        const userSubscriptions = await UserSubscription.find()
        console.log("nourboutar")

        res.status(200).json({
            status: 'success',
            results: userSubscriptions.length,
            data: {
                userSubscriptions
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: 'error in fetchong all userSubscriptions data'
        })
    }
    
}

exports.createUserSubscription = async (req , res) => {
    try{        
        const { id_user, id_subscription} = req.body;        
        const start_date = new Date();
        const end_date = new Date();
        const subs = await Subscription.findById({_id:id_subscription})
        console.log("subbb"+subs)
        if(subs.type=="weekly"){
            end_date.setDate(end_date.getDay()+7);
            console.log("end-date"+end_date)

        }
         if(subs.type=="monthly"){
            end_date.setMonth(end_date.getMonth() + 1);
            console.log("end date"+end_date)
           

        } if(subs.type=="yearly"){
            end_date.setFullYear(end_date.getFullYear() + 1);
            console.log("end date"+end_date)
            
        }
        const userSubscription = await UserSubscription.create({
            start_date:start_date,
            end_date:end_date,
            id_user:id_user,
            id_subscription:id_subscription,
            status:"active"

        })
        res.status(201).json({
            status: 'success',
            data: {
                userSubscription
            }

        })


    }catch(err){
        res.json({
            status: 'fail',
            message: err
        })
    }
}

exports.getUserSubscriptionById = async (req , res) => {
    try{
        const userSubscription = await UserSubscription.findById(req.params.id)

        res.json({
            status: 'success',
            userSubscription
        })
    }catch(err){
        res.json({
            status: fail,
            message: "error in getting a uerSubscription"
        })
    }

}

exports.updateUserSubscription = async (req , res) =>{

    try{
        const userSubscription = await UserSubscription.findByIdAndUpdate(req.params.id , req.body , {
            new: true,
            runValidators: true
        })
    
        res.json({
            status: 'success',
            userSubscription
        })
    }catch(err){
        res.json({
            status: "fail",
            message: 'fail in updating'
        })
    }
}

exports.deleteUserSubscription = async (req , res) => {
    try{
        await UserSubscription.findByIdAndDelete(req.params.id)

        res.json({
            status: 'success',
            message : 'deleted succefully'
        })
    }catch(err){
        res.json({
            status: "fail",
            message: 'fail in deleting userSubscription'
        })
    }
}

exports.getSingleUserSubscriptions = async (req , res) => {
    try{
        const userSubscriptions = await UserSubscription.find({ id_user: req.params.idUser })
        .populate('id_subscription') 
        .exec();
        console.log(req.cookies)
        const flattenedSubscriptions = userSubscriptions.map((subscription) => ({
            _id: subscription._id,
            start_date: subscription.start_date,
            end_date: subscription.end_date,
            id_user: subscription.id_user,
            status:subscription.status,
            subscription_id: subscription.id_subscription._id,
            subscription_type: subscription.id_subscription.subscriptionType,
            subscription_price: subscription.id_subscription.price,
            subscription_description: subscription.id_subscription.description,
            subscription_photo: subscription.id_subscription.photo,
            __v: subscription.__v,
        }));

        res.json({
            status: 'success',
            results: flattenedSubscriptions.length,
            data: {
                userSubscriptions: flattenedSubscriptions,
            },
        });

    }catch(err){
        res.json({
            status: 'fail',
            message: 'error in getting subscriptions of the user'
        })
    }
}
// exports.AvailabeSubscription=async(req,res)=>{
//     try{

//         const User_subscription=await UserSubscription.find({type:"available"}).populate('id_user').exec()
//         if(!User_subscription)res.status()

//     }catch(error){

//     }
// }
exports.AvailableSubscription = async (req, res) => {
    try {
        const  id_user  = req.params.id; 
        var status=""

        if (!id_user) {
            return res.status(400).json({
                message: 'User ID is required.'
            });
        }

   
        const userSubscription = await UserSubscription.findOne({
            id_user: id_user,
            status: "active"
        });

        if (!userSubscription) {
             status="unavailable"
        }else{
            status=userSubscription.status
        }
        res.status(200).json({
            status
            
            
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.getCurrentUserSubscription = async (req , res) => {

    try{
        const user = await User.findById(req.params.id)
        const userSubscriptions = await UserSubscription.findOne()
            .where('id_user').equals(req.params.id)
            .where('start_date').lte(new Date())
            .where('end_date').gte(new Date())

            console.log("wouhh"+user)



        if(userSubscriptions){
            const end_date = userSubscriptions.end_date.toLocaleDateString('fr-FR')
            res.json({
                status: 'success',
                data: {
                    user,
                    userSubscriptions,
                    end_date
                }
            })
        }else{
            res.json({
                status: 'success',
                data: {
                    userSubscriptions : null,
                    user,
                }
            })
        }
 
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}