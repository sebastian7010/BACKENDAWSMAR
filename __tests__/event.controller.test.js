const request = require('supertest');
const app = require('./../index');
const mongoose = require('mongoose');
const Event = require('./../models/Event');

jest.setTimeout(30000);


describe('Event Controller Testing', () => {
    const name = 'Sample Event';
    const img = 'event.png';
    const description = 'This is a sample event';
    const value = 50;


    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 30000
        });
    });

    beforeEach(async() => {
        await Event.deleteMany({});
    });

    afterAll(async() => {
        await Event.deleteMany({});
        await mongoose.connection.close();
    });



    it('Debería devolver un error al crear un evento si ocurre un problema', async() => {
        jest.spyOn(Event.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/api/createEvent')
            .send({ name, img, description, value });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('msg', 'contact to developer, internal error');
    });

    it('Debería obtener un evento por ID', async() => {
        const event = await new Event({ name, img, description, value }).save();

        const response = await request(app)
            .get(`/api/getEventById/${event._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('msg', ' el evento es');
        expect(response.body.event).toHaveProperty('name', name);
    });

    it('Debería obtener todos los eventos', async() => {
        await new Event({ name, img, description, value }).save();

        const response = await request(app)
            .get('/api/getAllEvent');

        expect(response.statusCode).toBe(200);
        expect(response.body.event.length).toBeGreaterThan(0);
        expect(response.body.ok).toBe(true);
    });

    it('Debería devolver un error al obtener todos los eventos si ocurre un problema', async() => {
        jest.spyOn(Event, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/api/getAllEvent');

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Error getting events, contact to support');
    });

    it('Debería eliminar un evento por ID', async() => {
        const event = await new Event({ name, img, description, value }).save();

        const response = await request(app)
            .delete(`/api/deleteEvent/${event._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Product deleted!!');
    });

    it('Debería devolver un error si ocurre un problema al eliminar el evento', async() => {
        jest.spyOn(Event, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .delete('/api/deleteEvent/validId');

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Error deleting product, contact to support');
    });
});