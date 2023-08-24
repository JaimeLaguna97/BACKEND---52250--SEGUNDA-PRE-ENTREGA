import { Router } from "express";
import Cart from "../../dao/models/CartModel.js";
import Product from "../../dao/models/productModel.js";

const router = Router();

router.get('/products', async (req, res) => {
    try {
      const products = await Product.find().exec();
      res.render('products', { products });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.product').exec();

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;