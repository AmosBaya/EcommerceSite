const Product = require('../models/Product');



// creating a product ---- to be continued later
exports.createProduct = async (req,res)=>{
    try {
        const { name, price }= req.body;

    } catch (error) {
        
    }
}


// get products
exports.getProducts = async (req,res)=>{
    try {
        const products = await Product.find([]);

        if(!products){
            return res.status(404).json({message:"No products found"})
        }

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message:"Error in fetching products", error: error.message})
    }
};

// get one product
exports.getOneProduct = async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message:"Error in fetching products", error: error.message})
    }
}