import Cart from "../../dao/models/CartModel.js";
import Product from "../../dao/models/productModel.js";

class CartManager {
    async createCart(newCart) {
        try {
            const cart = new Cart(newCart);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Failed to create cart');
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            return cart ? cart.products : null;
        } catch (error) {
            throw new Error('Failed to get cart');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);

            if (!cart) {
                return null; // Cart not found
            }

            const product = await Product.findById(productId);

            if (!product) {
                return null; // Product not found
            }

            cart.products.push({ product: productId, quantity });
            await cart.save();

            return cart.products;
        } catch (error) {
            console.error(error);
            return null; // Handle errors
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
    
            if (!cart) {
                return null; // Cart not found
            }
    
            console.log('Cart found:', cart);
    
            const productIndex = cart.products.findIndex(product => product.product.equals(productId));
    
            if (productIndex !== -1) {
                // Remove the product from the cart
                cart.products.splice(productIndex, 1);
                await cart.save();
    
                console.log('Product removed:', productId);
    
                return cart.products;
            }
    
            console.log('Product not found in cart');
            return null;
        } catch (error) {
            console.error(error);
            return null; // Handle errors
        }
    }

    async deleteCart(cartId) {
        //Remove Cart
        try {
            const deletedCart = await Cart.findByIdAndDelete(cartId);
            return deletedCart;
        } catch (error) {
            console.error(error);
            return null; // Handle errors
        }
    }

    async getCartWithTotalPrice(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product').exec();

            if (!cart) {
                return null;
            }

            // Calculate total price
            let totalPrice = 0;
            cart.products.forEach(productInCart => {
                totalPrice += productInCart.quantity * productInCart.product.price;
            });
            return { cart, totalPrice };
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw new Error('Internal Server Error');
        }
    }
}

export default CartManager;