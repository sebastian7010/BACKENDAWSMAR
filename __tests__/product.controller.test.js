const request = require('supertest');
const app = require('./../index');
const mongoose = require('mongoose');
const Product = require('./../models/Product');

jest.setTimeout(30000);


describe('Product Controller Testing', () => {
    const name = 'Sample Product';
    const feature = true;
    const img = 'image.png';
    const description = 'This is a sample product';
    const value = 100;

    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 30000
        });
    });

    beforeEach(async() => {
        await Product.deleteMany({});
    });

    afterAll(async() => {
        await Product.deleteMany({});
        await mongoose.connection.close();
    });

    it('Debería crear un producto exitosamente', async() => {
        const response = await request(app)
            .post('/api/createProduct')
            .send({ name, feature, img, description, value });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('msg', `${name} created successfully`);
        expect(response.body.ok).toBe(true);
    });

    it('Debería evitar la creación de un producto duplicado', async() => {
        await new Product({ name, feature, img, description, value }).save();

        const response = await request(app)
            .post('/api/createProduct')
            .send({ name, feature, img, description, value });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('msg', `${name} Product is already exist in database`);
    });

    it('Debería devolver un error al crear un producto si ocurre un problema', async() => {
        jest.spyOn(Product.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/api/createProduct')
            .send({ name, feature, img, description, value });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('msg', 'contact to Developer, internal error');
    });

    it('Debería obtener un producto por ID', async() => {
        const product = await new Product({ name, feature, img, description, value }).save();

        const response = await request(app)
            .get(`/api/getProductById/${product._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('msg', `el producto ${product.name} es`);
        expect(response.body.product).toHaveProperty('name', name);
    });


    it('Debería obtener todos los productos', async() => {
        await new Product({ name, feature, img, description, value }).save();

        const response = await request(app)
            .get('/api/getAllProduct');

        expect(response.statusCode).toBe(200);
        expect(response.body.products.length).toBeGreaterThan(0);
        expect(response.body.ok).toBe(true);
    });

    it('Debería devolver un error al obtener los productos si ocurre un problema', async() => {
        jest.spyOn(Product, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/api/getAllProduct');

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Error getting products, contact to support');
    });

    it('Debería eliminar un producto por ID', async() => {
        const product = await new Product({ name, feature, img, description, value }).save();

        const response = await request(app)
            .delete(`/api/deleteProduct/${product._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('msg', 'product deleted!!');
    });


    it('Debería devolver un error si ocurre un problema al eliminar el producto', async() => {
        jest.spyOn(Product, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .delete('/api/deleteProduct/validId');

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Error deleting product, contact to support');
    });
});