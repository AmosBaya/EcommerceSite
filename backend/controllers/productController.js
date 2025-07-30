const Product = require('../models/Product');



// creating a product 
exports.createProduct = async (req,res)=>{
    try {
        const { 
            title,
            description,
            price,
            discountPercentage,
            rating,
            stock,
            brand,
            category,
            thumbnail,
            images,
            deleted
        }= req.body;

        // Basic required field validation
        if (!title || !price || !category) {
            return res.status(400).json({ message: "Title, price, and category are required." });
        }

        const product = new Product({
            title,
            description,
            price,
            discountPercentage,
            rating,
            stock,
            brand,
            category,
            thumbnail,
            images,
            deleted
        });

        await product.save();

        res.status(201).json({message:"product created successfully", product})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error: error.message});
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

