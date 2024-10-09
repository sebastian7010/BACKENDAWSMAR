const express = require('express')
const router = express.Router()
const { createProduct, getAllProduct, getProductById, deleteProductById } = require('./../controllers/product.controller')


router.post('/createProduct', createProduct)
router.get('/getAllProduct', getAllProduct);
router.get('/getProductById/:id', getProductById);
router.delete('/deleteProduct/:id', deleteProductById)


module.exports = router