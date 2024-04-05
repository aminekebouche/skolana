import app from '../../../src/app';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { config } from '../../../src/config/config';

const url = config.mongo.url;

beforeEach((done) => {
    mongoose.connect(url, () => done());
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

test('GET /user/all/:id', async () => {
    await supertest(app).get('/api/posts/dddddd').expect(400);
});
