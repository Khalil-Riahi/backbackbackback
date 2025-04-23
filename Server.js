const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const app=require('./app')
const initCronJobs = require('./Jobs/Refrech'); // Assuming you created this

const db=process.env.DATABASE
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log('DB Connection Successful'))

mongoose.connection.on("connected", () => {
    console.log("✅ Connected to MongoDB");
    initCronJobs(); // Start cron jobs AFTER DB connection
  });
// console.log(process.env)

const port =8000
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
});