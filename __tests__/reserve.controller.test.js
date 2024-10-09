const request = require('supertest');
const app = require('./../index');
const mongoose = require('mongoose');
const Reserve = require('./../models/Reserve');

describe('Reserve Controller Testing', () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const number = '123456789';
    const date = '2024-10-15';

    jest.setTimeout(30000);


    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 30000
        });
    });

    beforeEach(async() => {
        await Reserve.deleteMany({});
    });

    afterAll(async() => {
        await Reserve.deleteMany({});
        await mongoose.connection.close();
    });

    it('Debería crear una reserva exitosamente', async() => {
        const response = await request(app)
            .post('/api/createReserve')
            .send({ name, email, number, date });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('msg', `The reserve of user ${name} is created succesfuly`);
        expect(response.body.ok).toBe(true);
    });
    it('Debería evitar crear una reserva duplicada', async() => {
        await new Reserve({ name, email, number, date }).save();

        const response = await request(app)
            .post('/api/createReserve')
            .send({ name, email, number, date });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('msg', `${name} This reserve is already exist in database`);
    });
    it('Debería devolver un error al crear una reserva si ocurre un problema', async() => {
        jest.spyOn(Reserve.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/api/createReserve')
            .send({ name, email, number, date });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('msg', 'contact to Developer, internal error');
    });

});