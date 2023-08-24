import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    stock: {type: Number, required: true},
    price: {type: Number, required:true}
});

const Product = mongoose.model('Product', productSchema);

export default Product;