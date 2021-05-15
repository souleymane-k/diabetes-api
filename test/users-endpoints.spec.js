'use strict';
/* globals supertest */
const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
require('./setup');
const UserService = require('../src/users/users-service');

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
        .expect(400, {message: {error: true, username: 'username must be at least 6 characters'}});
        
    });


    it('returns 400 and error message if invalid email format', () => {
      const requestBody = helpers.createNewUserRequest();
      requestBody.username = 'foo.com';

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
        requestBody.username = testUsers[0].username;
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
          expect(res.body.username).to.equal(savedUser.username);
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
    beforeEach('create users, results', async () => {
      await helpers.createUsers(db, testUsers);
      await helpers.createResults(db, result_id);
    });
    it('returns details on the current user and current cycle', () => {
      return supertest(app)
        .get('/api/users/1')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .expect(200)
        .then(res => {
          expect(res.body.currentUser.username).to.equal(testUsers[0].username);
          expect(res.body.currentUser.result).to.equal(testUsers[0].result);
          
        });
    });
    
  });
});

// const knex = require('knex')
// const bcrypt = require('bcryptjs')
// const app = require('../src/app')
// const helpers = require('./test-helpers')

// describe('Users Endpoints', function() {
//   let db

//   const { testUsers } = helpers.makeArticlesFixtures()
//   const testUser = testUsers[0]

//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DB_URL,
//     })
//     app.set('db', db)
//   })

//   after('disconnect from db', () => db.destroy())

//   before('cleanup', () => helpers.cleanTables(db))

//   afterEach('cleanup', () => helpers.cleanTables(db))

//   describe(`POST /api/users`, () => {
//     context(`User Validation`, () => {
//       beforeEach('insert users', () =>
//         helpers.seedUsers(
//           db,
//           testUsers,
//         )
//       )

//       const requiredFields = ['user_name', 'password', 'full_name']

//       requiredFields.forEach(field => {
//         const registerAttemptBody = {
//           user_name: 'test user_name',
//           password: 'test password',
//           full_name: 'test full_name',
//           nickname: 'test nickname',
//         }

//         it(`responds with 400 required error when '${field}' is missing`, () => {
//           delete registerAttemptBody[field]

//           return supertest(app)
//             .post('/api/users')
//             .send(registerAttemptBody)
//             .expect(400, {
//               error: `Missing '${field}' in request body`,
//             })
//         })
//       })

//       it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
//         const userShortPassword = {
//           user_name: 'test user_name',
//           password: '1234567',
//           full_name: 'test full_name',
//         }
//         return supertest(app)
//           .post('/api/users')
//           .send(userShortPassword)
//           .expect(400, { error: `Password be longer than 8 characters` })
//       })

//       it(`responds 400 'Password be less than 72 characters' when long password`, () => {
//         const userLongPassword = {
//           user_name: 'test user_name',
//           password: '*'.repeat(73),
//           full_name: 'test full_name',
//         }
//         return supertest(app)
//           .post('/api/users')
//           .send(userLongPassword)
//           .expect(400, { error: `Password be less than 72 characters` })
//       })

//       it(`responds 400 error when password starts with spaces`, () => {
//         const userPasswordStartsSpaces = {
//           user_name: 'test user_name',
//           password: ' 1Aa!2Bb@',
//           full_name: 'test full_name',
//         }
//         return supertest(app)
//           .post('/api/users')
//           .send(userPasswordStartsSpaces)
//           .expect(400, { error: `Password must not start or end with empty spaces` })
//       })

//       it(`responds 400 error when password ends with spaces`, () => {
//         const userPasswordEndsSpaces = {
//           user_name: 'test user_name',
//           password: '1Aa!2Bb@ ',
//           full_name: 'test full_name',
//         }
//         return supertest(app)
//           .post('/api/users')
//           .send(userPasswordEndsSpaces)
//           .expect(400, { error: `Password must not start or end with empty spaces` })
//       })

//       it(`responds 400 error when password isn't complex enough`, () => {
//         const userPasswordNotComplex = {
//           user_name: 'test user_name',
//           password: '11AAaabb',
//           full_name: 'test full_name',
//         }
//         return supertest(app)
//           .post('/api/users')
//           .send(userPasswordNotComplex)
//           .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
//       })

//       it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
//         const duplicateUser = {
//           user_name: testUser.user_name,
//           password: '11AAaa!!',
//           full_name: 'test full_name',
//         }
//         return supertest(app)
//           .post('/api/users')
//           .send(duplicateUser)
//           .expect(400, { error: `Username already taken` })
//       })
//     })

//     context(`Happy path`, () => {
//       it(`responds 201, serialized user, storing bcryped password`, () => {
//         const newUser = {
//           user_name: 'test user_name',
//           password: '11AAaa!!',
//           full_name: 'test full_name',
//         }
//         return supertest(app)
//           .post('/api/users')
//           .send(newUser)
//           .expect(201)
//           .expect(res => {
//             expect(res.body).to.have.property('id')
//             expect(res.body.user_name).to.eql(newUser.user_name)
//             expect(res.body.full_name).to.eql(newUser.full_name)
//             expect(res.body.nickname).to.eql('')
//             expect(res.body).to.not.have.property('password')
//             expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
//             const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
//             const actualDate = new Date(res.body.date_created).toLocaleString()
//             expect(actualDate).to.eql(expectedDate)
//           })
//           .expect(res =>
//             db
//               .from('blogful_users')
//               .select('*')
//               .where({ id: res.body.id })
//               .first()
//               .then(row => {
//                 expect(row.user_name).to.eql(newUser.user_name)
//                 expect(row.full_name).to.eql(newUser.full_name)
//                 expect(row.nickname).to.eql(null)
//                 const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
//                 const actualDate = new Date(row.date_created).toLocaleString()
//                 expect(actualDate).to.eql(expectedDate)

//                 return bcrypt.compare(newUser.password, row.password)
//               })
//               .then(compareMatch => {
//                 expect(compareMatch).to.be.true
//               })
//           )
//       })
//     })
//   })
// })
