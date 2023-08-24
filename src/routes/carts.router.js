import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/', (req,res) => {
    //Handle POST request to create a new cart
    const newCart = req.body;
    const cart = cartManager.createCart(newCart);
    res.json(cart);
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { cart, totalPrice } = await cartManager.getCartWithTotalPrice(cartId);

        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        res.render('cart', { cart, totalPrice }); // Pass totalPrice to the template
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/:cid/product/:pid', (req,res) => {
    //Handle POST request to add a product to a cart.
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    const product = cartManager.addProductToCart(cartId, productId, quantity);

    if(!product) {
        res.status(404).json({error: 'Product or cart not found'});
    } else {
        res.json(product);
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        console.log('Deleting product:', productId, 'from cart:', cartId);

        const result = await cartManager.deleteProductFromCart(cartId, productId);

        if (result) {
            console.log('Product deleted:', result);
            res.json(result);
        } else {
            console.log('Product not found in cart:', productId);
            res.status(404).json({ error: 'Cart or product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:cid', async (req,res) =>{
    try {
        const cartId = req.params.cid;
        const updatedCart = req.body.products;

        const result = await cartManager.updateCart(cartId, updatedCart);

        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const result = await cartManager.updateProductQuantity(cartId, productId, quantity);

        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Product or cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const result = await cartManager.deleteProductFromCart(cartId, productId);

        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Cart or product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const deletedCart = await cartManager.deleteCart(cartId);

        if (deletedCart) {
            res.json({ success: true, message: 'Cart deleted successfully' });
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;