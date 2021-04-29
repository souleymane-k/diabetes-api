'use strict';
/* globals supertest */
const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
require('./setup');
const UserService = require('../src/users/user-service');

describe('User Endpoints', () => {
  let db;
  const testUsers = helpers.testUsers();

  before('connect db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });

    app.set('db', db);
  });

  before('clear table data', () => helpers.cleanTables(db));
  afterEach('clear table data', () => helpers.cleanTables(db));
  after('close db connection', () => db.destroy());

  describe('POST api/users', () => {
    const requiredFields = ['username', 'email', 'password'];
    requiredFields.forEach(field => {
      it(`returns 400 and error message when ${field} is missing`, () => {
        const requestBody = helpers.createNewUserRequest();
        delete requestBody[field];

        return supertest(app)
          .post('/api/users')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400, {message: `${field} is required`});
      });
    });

    requiredFields.forEach(field => {
      it(`returns 400 if ${field} begins or ends with spaces`, () => {
        const requestBody = helpers.createNewUserRequest();
        requestBody[field] = ` ${requestBody[field]} `; 

        return supertest(app)
          .post('/api/users')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400, {message: `${field} cannot begin or end with spaces`});
      });
    });

    it('returns 400 and error message if username is less than 3 characters', () => {
      const requestBody = helpers.createNewUserRequest();
      requestBody.username = 'f';

      return supertest(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(400, {message: {error: true, username: 'username must be at least 3 characters'}});
        
    });


    it('returns 400 and error message if invalid email format', () => {
      const requestBody = helpers.createNewUserRequest();
      requestBody.email = 'foo.com';

      return supertest(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(400, {message: {error: true, email: 'invalid email format'}});
    });

    it('returns 400 and error message if password less than 6 characters', () => {
      const requestBody = helpers.createNewUserRequest();
      requestBody.password = '12345';
      return supertest(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(400, {message: {error: true, password: 'password must be at least 6 characters'}});
    });


    context('when a user already exists', () => {
      before('create users', async () => await helpers.createUsers(db, testUsers));
      it('returns 400 and error message if same email is used', () => {
      
        const requestBody = helpers.createNewUserRequest();
        requestBody.email = testUsers[0].email;
  
        return supertest(app)
          .post('/api/users')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400, {message: 'email is already in use'});
      });
    });
    
    it('returns 201, user obj, location and auth headers when saved successfully', () => {
      const requestBody = helpers.createNewUserRequest();
      
      return supertest(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(201)
        .then(async res => {
          const savedUser = await UserService.findById(db, res.body.id);
          const expectedAuthToken = helpers.createAuthToken(savedUser).split(' ')[1];
          expect(res.headers.location).to.equal(`/api/users/${savedUser.id}`);
          expect(res.body.authToken).to.equal(expectedAuthToken);
          expect(res.body.full_name).to.equal(savedUser.full_name);
          expect(res.body.email).to.equal(savedUser.email);
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.password).to.be.undefined;
          const isMatch = await bcrypt.compare(requestBody.password, savedUser.password);
          // eslint-disable-next-line no-unused-expressions
          expect(isMatch).to.be.true;
        });
    });
  });

  describe('GET /api/users/:user_id', () => {
    const testUsers = helpers.testUsers();
    const testCycle = helpers.testCycle();
    const cycle_id = 1;
    beforeEach('create users, cycle and workouts', async () => {
      await helpers.createUsers(db, testUsers);
      await helpers.createCycle(db, testCycle);
      await helpers.createWorkouts(db, cycle_id, testCycle.training_freq);
    });
    
  });
});