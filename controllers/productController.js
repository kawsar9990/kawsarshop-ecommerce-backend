const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try{
    const {category, isHomePage, isHomeTab, isFeatured, isLatest, isAllProduct} = req.query;
    let filter = {};
    
    if(category){
    filter.$or = [
        { category: category },
        { subCategory: category }
    ]
    }

    if(isHomePage === 'true'){
        filter.isHomePage = true;
    }
     if(isHomeTab === 'true'){
        filter.isHomeTab = true;
    }
    if(isFeatured !== undefined){
        filter.isFeatured = (isFeatured === 'true');
    }
      if(isLatest === 'true'){
        filter.isLatest = true;
    }
     if(isAllProduct === 'true'){
        filter.isAllProduct = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.status(200).json(products)
}
    catch (error) {
    res.status(500).json({ message: "Sorry No Data Match", error: error.message })
    }
}

module.exports = {getProducts};
