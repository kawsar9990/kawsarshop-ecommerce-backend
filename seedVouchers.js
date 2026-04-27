const mongoose = require('mongoose');
const Voucher = require('./models/Voucher');
require('dotenv').config();

const vouchers = [
{ 
    code: "KAWSARDEVELOPER99", 
    value: 30, 
    type: "percentage", 
    minAmount: 100,
    usageLimit: 50,
    expiryDate: new Date("2026-12-31")
  },
  { 
    code: "HEYBABY99", 
    value: 30, 
    type: "percentage", 
    minAmount: 100,
    usageLimit: 70,
    expiryDate: new Date("2026-12-31")
  },
  { 
    code: "KAWSARSHOP899", 
    value: 30, 
    type: "percentage", 
    minAmount: 100,
    usageLimit: 90,
    expiryDate: new Date("2026-12-31") 
  },
  { 
    code: "TOMISLAM2032007", 
    value: 30, 
    type: "percentage", 
    minAmount: 100,
    usageLimit: 60,
    expiryDate: new Date("2026-12-31")
  },
   { 
    code: "SUNNYLEAON95", 
    value: 30, 
    type: "percentage", 
    minAmount: 100,
    usageLimit: 60,
    expiryDate: new Date("2026-12-31")
  },
  { 
    code: "JONYSHINGH89", 
    value: 30, 
    type: "percentage", 
    minAmount: 100,
    usageLimit: 65,
    expiryDate: new Date("2026-12-31")
  },
  { 
    code: "MIAKHOLIFA753", 
    value: 30, 
    type: "percentage", 
    minAmount: 100,
    usageLimit: 85,
    expiryDate: new Date("2026-12-31")
  },   
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