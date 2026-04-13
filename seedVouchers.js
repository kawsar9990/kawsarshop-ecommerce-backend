const mongoose = require('mongoose');
const Voucher = require('./models/Voucher');
require('dotenv').config();

const vouchers = [
{ 
    code: "KAWSARDEVELOPER99", 
    value: 30, 
    type: "percentage", 
    minAmount: 100 
  },
  { 
    code: "HEYBABY99", 
    value: 30, 
    type: "percentage", 
    minAmount: 100 
  },
  { 
    code: "KAWSARSHOP899", 
    value: 30, 
    type: "percentage", 
    minAmount: 100 
  },
  { 
    code: "TOMISLAM2032007", 
    value: 30, 
    type: "percentage", 
    minAmount: 100 
  }    
];

const seedDB = async () => {
    try{
        if(!process.env.MONGODB_URL){
            console.log({ status: 500, message: "MONGODB_URL is missing in .env" });
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URL); 
        await Voucher.deleteMany({});
        await Voucher.insertMany(vouchers);
        console.log({
          status: 200,
          success: true,
          message: "Vouchers Seeded Successfully!",
          count: vouchers.length
        });
        process.exit();
    }catch(error){
        console.log({
          status: 500,
          success: false,
          error: error.message
        });
         process.exit(1);
    }
}

seedDB();