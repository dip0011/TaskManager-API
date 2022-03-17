const request = require('supertest');
const app = require('../src/app');
const User = require('../src/db/models/user');
const mongoose = require('mongoose');
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async()=>{
    const response = await request(app)
        .post('/users')
        .send({
            name:'Dip',
            email: 'dip1234@gmail.com',
            password: 'dip1234'
        }).expect(201);

    // assert new user creation
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // assertion about the response
    expect(typeof response.body).toBe('object');
    expect(user.password).not.toBe('dip1234');
});

test('Should login existing user', async()=>{
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200);
    
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
    
});

test('Should not login non-existing user', async()=>{
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'Thisisnotcorrect'
        }).expect(400);
});

test('Should get profile for authenticated user', async()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for non-authenticated user', async()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for authenticated user', async()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

        const user = await User.findById(userOneId);
        expect(user).toBeNull();
});

test('Should not delete account for non-authenticated user', async()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar', async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid details', async()=>{
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'user'
        })
        .expect(202);
    const user = await User.findById(userOneId);
    expect(response.body.name).toBe(user.name);
});

test('Should not update invalid details', async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'localhost'
        })
        .expect(412);
});

afterAll(done => {
    mongoose.connection.close()
    done()
})