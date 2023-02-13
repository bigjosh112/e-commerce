const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');


exports.createProduct = asyncHandler(async(req, res) => {
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    } catch {
        throw new Error(error)
    }
})

//update Products
exports.updateProduct = asyncHandler(async(req, res) => {
    
    const { id } = req.params;
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate( 
            id , 
            
                req.body
            , {
            new: true,
        });
         res.json(updateProduct);
    } catch {
        throw new Error(error)
    }
})

exports.deleteProduct = asyncHandler(async(req, res) => {
    
    const { id } = req.params;
    try{
        
        const deleteProduct = await Product.findByIdAndDelete(id);
         res.json(deleteProduct);
    } catch {
        throw new Error(error)
    }
})


exports.getaProduct = asyncHandler(async(req, res) => {
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct)
    } catch {
        throw new Error(error)
    }
})


exports.getAllProduct = asyncHandler(async(req, res) => {
    
    try{

        //filtering
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        //console.log(queryObj)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        
       // console.log(queryStr)

        let query =  Product.find(JSON.parse(queryStr));
        //console.log(product)

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt")
         };

         //limiting the fields
         if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            query = query.select("-__v")
         }

         //pagination
         const page = req.query.page;
         const limit = req.query.limit;
         const skip = (page - 1) * limit;
         query = query.skip(skip).limit(limit);
         if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error('This page doesn\'t exist')
         }

        const products = await query;
        //console.log(query)
         res.json(products)
    } catch {
        throw new Error(error)
    }
})

// exports.filterProduct = asyncHandler(async(req, res) => {
//     const {minprice, maxprice, color, category, avaliablity,brand} = req.params;
//     console.log(req.query);
//     try{
//         const filterProduct = await Product.find({
//             price: {
//                 $gte: minprice,
//                 $lte: maxprice
            
//             },
//             category,
//             brand,
//             color,
//         });
//         res.json(filterProduct)
//     } catch {
//         throw new Error(error)
//     }
// })
