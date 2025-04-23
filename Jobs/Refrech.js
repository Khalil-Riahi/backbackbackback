const cron = require("node-cron");
const mongoose = require("mongoose");
const TablePayment=require("./../Models/Reservation")
const Table=require("./../Models/Table")
const moment = require('moment'); 
const initCronJobs = () => {
cron.schedule("0 0 * * *", async () => {
  console.log("Checking for expired userSubscription...");

  try {
    const result = await userSubscription.updateMany(
      { end_date: { $lt: new Date() }, status: "active" },
      { $set: { status: "unavailable" } }
    );

    console.log(`${result.modifiedCount} userSubscription updated.`);
  } catch (error) {
    console.error("Error updating userSubscription:", error);
  }
});


cron.schedule("*/45 * * * *", async () => {
  console.log("🔄 Checking for expired Table Payments...");

  try {
    const now = new Date();
      const currentTime = moment(now).format('HH:mm'); 
      const expiredPayments = await TablePayment.find({
        date: { $lte:new Date()},
        check_out: { $lte: currentTime }
      });

      console.log(`🧾 Found ${expiredPayments.length} expired table payments.`);
      
      if (expiredPayments.length > 0) {
        const tableIds = expiredPayments.map(payment => payment.numTable);
        const result = await Table.updateMany(
          { 
            numTable: { $in: tableIds }, 
            status: { $ne: "available" } 
          },
          { $set: { status: "available" } }
        );
        console.log(`✅ ${result.modifiedCount} tables updated to 'available'.`);
      }
  } catch (error) {
    console.error("❌ Error updating table statuses:", error);
  }
});}
module.exports = initCronJobs;

