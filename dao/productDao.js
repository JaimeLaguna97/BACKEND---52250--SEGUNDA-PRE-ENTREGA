import Product from "./models/productModel";

//Function to create a new product.
export const createProduct = async (productData) => {
    try {
        const product = new Product(productData);
        await product.save();
        return product;
    } catch (error) {
        throw new Error('Failed to create product');
    }
};

//Function to get all products.
export const getAllProducts = async () => {
    try {
        const products = await Product.find({});
        return products;
    } catch {
        throw new Error ('Failed to get products');
    }
};