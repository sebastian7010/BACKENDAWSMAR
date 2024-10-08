const request = require('supertest');
const app = require('./../index');
const mongoose = require('mongoose');
const Reserve = require('./../models/Reserve');

describe('Reserve Controller Testing', () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const number = '123456789';
    const date = '2024-10-15';

    beforeEach(async() => {
        await Reserve.deleteMany({});
    }, 30000);

    afterAll(async() => {
        await Reserve.deleteMany({});
        await mongoose.connection.close();
    });

    it('Debería crear una reserva exitosamente', async() => {
        const response = await request(app)
            .post('/reserves')
            .send({ name, email, number, date });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('msg', `The reserve of user ${name} is created succesfuly`);
        expect(response.body.ok).toBe(true);
    });
});