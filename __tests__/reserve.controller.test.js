const request = require('supertest');
const app = require('./../index');
const mongoose = require('mongoose');
const Reserve = require('./../models/Reserve');

describe('Reserve Controller Testing', () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const number = '123456789';
    const date = '2024-10-15';

    // Conectar a la base de datos antes de todas las pruebas
    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 10000 // Aumenta el tiempo de espera para la conexión
        });
    });

    // Limpiar las reservas antes de cada prueba
    beforeEach(async() => {
        await Reserve.deleteMany({});
    });

    // Cerrar la conexión a la base de datos y limpiar después de todas las pruebas
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
});