import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import productsController from '../controllers/products.controller.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
      const { limit, page, sort, query } = req.query;

      const products = await productManager.getAllProducts({
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort,
        query
      });

      //Calculate total number of pages
      const totalPages = Math.ceil(products.lenght / (parseInt(limit) || 10));

      //Calculate previous and next page numbers
      const currentPage = parseInt(page) || 1;
      const prevPage = currentPage > 1 ? currentPage - 1 : null;
      const nextPage = currentPage < totalPages ? currentPage + 1 : null;

      //Generate prevLink and nextLink URls
      const prevLink = prevPage ? `?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null;
      const nextLink = nextPage ? `?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null;

      res.json({
        status: 'success',
        payload: products,
        totalPages,
        prevPage,
        nextPage,
        page: currentPage,
        hasPrevPage: prevPage !== null,
        hasNextPage: nextPage !== null,
        prevLink,
        nextLink
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.post ('/', async (req,res) => {
    try {
        const newProduct = req.body;
        const createdProduct = await productManager.addProduct(newProduct);
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({error: 'Bad request'});
    }
});

router.get('/:pid', async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productManager.getProductById(productId);
  
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json(product);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:pid', async (req,res) => {
    try {
        const productId = req.params.pid;
        const updatedProductData = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updatedProductData);

        if (!updatedProduct) {
            res.status(404).json({error: 'Product not found'});
        } else {
            res.json(updatedProduct);
        }
    } catch (error) {
        res.status(400).json({error: 'Bad request'});
    }
});

router.delete('/:pid', async (req, res) => {
    try {
      const productId = req.params.pid;
      const deletedProduct = await productManager.deleteProduct(productId);
  
      if (!deletedProduct) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json(deletedProduct);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', productsController.renderProductsView);

export default router;