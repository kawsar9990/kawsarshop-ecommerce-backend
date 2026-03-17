// const Product = require('../models/Product');

// const getProducts = async (req, res) => {
//     try{
//     const {category, isHomePage, isHomeTab, isFeatured, isLatest, isAllProduct} = req.query;
//     let filter = {};
    
//     if(category){
//     filter.$or = [
//         { category: category },
//         { subCategory: category }
//     ]
//     }

//     if(isHomePage === 'true'){
//         filter.isHomePage = true;
//     }
//      if(isHomeTab === 'true'){
//         filter.isHomeTab = true;
//     }
//     if(isFeatured !== undefined){
//         filter.isFeatured = (isFeatured === 'true');
//     }
//       if(isLatest === 'true'){
//         filter.isLatest = true;
//     }
//      if(isAllProduct === 'true'){
//         filter.isAllProduct = true;
//     }

//     const products = await Product.find(filter).sort({ createdAt: -1 })
//     res.status(200).json(products)
// }
//     catch (error) {
//     res.status(500).json({ message: "Sorry No Data Match", error: error.message })
//     }
// }

// module.exports = {getProducts};







const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const { category, isHomePage, isHomeTab, isFeatured, isLatest, isAllProduct } = req.query;
        
        // ১. ফ্রন্টএন্ড থেকে আসা কুয়েরিগুলো চেক করার জন্য
        console.log("--- New API Request Received ---");
        console.log("Query Params:", req.query);

        let filter = {};
        
        if (category) {
            // সাব-ক্যাটাগরিতে Laptop/Mobile পাওয়ার জন্য Regex ব্যবহার করা ভালো
            const regex = new RegExp(category, 'i');
            filter.$or = [
                { category: regex },
                { subCategory: regex }
            ];
        }

        if (isHomePage === 'true') filter.isHomePage = true;
        if (isHomeTab === 'true') filter.isHomeTab = true;

        // ২. এই ফিল্টারটা খুব সাবধানে চেক করুন
        if (isFeatured !== undefined && isFeatured !== "") {
            filter.isFeatured = (isFeatured === 'true');
        }

        if (isLatest === 'true') filter.isLatest = true;
        if (isAllProduct === 'true') filter.isAllProduct = true;

        // ৩. ফাইনাল ফিল্টার অবজেক্টটি চেক করার জন্য (সবচেয়ে জরুরি)
        console.log("Final MongoDB Filter Object:", JSON.stringify(filter, null, 2));

        const products = await Product.find(filter).sort({ createdAt: -1 });
        
        console.log("Total Products Found:", products.length);
        console.log("---------------------------------");

        res.status(200).json(products);
    }
    catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).json({ message: "Sorry No Data Match", error: error.message });
    }
}

module.exports = { getProducts };