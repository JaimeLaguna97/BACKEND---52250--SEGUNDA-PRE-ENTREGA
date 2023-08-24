import Product from "../../dao/models/productModel.js";

const renderProductsView = async (req, res) => {
    try {
        const products = await Product.find().exec();
        res.render('products', { products });
    } catch (error) {
        console.error('Error rendering products view:', error);
        res.status(500).send('Internal Server Error');
    }
};

export default { renderProductsView };