const Product = require('./../models/Product');

const createProduct = async(req, res) => {
    const { name, feature, img, description, value } = req.body;

    try {
        const product = await Product.findOne({ name: name });
        if (product) {
            return res.status(400).json({
                ok: false,
                msg: `${name} Product is already exist in database`
            });
        }

        const dbProduct = new Product({
            name,
            feature,
            img,
            description,
            value
        });
        await dbProduct.save();

        return res.status(201).json({
            ok: true,
            msg: `${name} created successfully`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'contact to Developer, internal error'
        });
    }
};

const getProductById = async(req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                ok: false,
                msg: 'product not found'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: `el producto ${product.name} es`,
            product: product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error Identify product for id'
        });
    }
};

const getAllProduct = async(req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            ok: true,
            products: products
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error getting products, contact to support'
        });
    }
};

const deleteProductById = async(req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(400).json({
                ok: false,
                msg: `Error deleting Product with Id ${id}`
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'product deleted!!'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error deleting product, contact to support'
        });
    }
};

module.exports = {
    createProduct,
    getProductById,
    getAllProduct,
    deleteProductById
};