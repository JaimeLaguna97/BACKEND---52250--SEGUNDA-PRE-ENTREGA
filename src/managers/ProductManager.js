import Product from '../../dao/models/productModel.js';

class ProductManager {
    async getAllProducts({ limit, page, sort, query }) {
        try {
            const options = {};

            if (query) {
                options.title = { $regex: query, $options: 'i' };
            }

            const totalProducts = await Product.countDocuments(options);
            const totalPages = Math.ceil(totalProducts / limit);
            const skip = (page - 1) * limit;

            const products = await Product.find(options)
                .sort(sort)
                .limit(limit)
                .skip(skip)
                .exec();

            return {
                products,
                totalPages,
                currentPage: page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
            };
        } catch (error) {
            throw new Error('Failed to get products');
        }
    }

    async getProductById(productId) {
        return await Product.findById(productId);
    }

    async addProduct(newProduct) {
        return await Product.create(newProduct);
    }

    async updateProduct(productId, updatedProduct) {
        return await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
    }

    async deleteProduct(productId) {
        return await Product.findByIdAndDelete(productId);
    }
}

export default ProductManager;