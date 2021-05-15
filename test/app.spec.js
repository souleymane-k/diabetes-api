const { expect } = require('chai')
 const supertest = require('supertest');
const app = require('../src/app')
//const {helpers,testUsers}= require('../test/test-helpers') 

describe('App', () => {
  it('GET / responds with 200 containing "Hello, diabetes-api!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, diabetes-api!')
  })

})
describe.skip('GET /months', () => {
  it('should return an array of months', () => {
    return supertest(app)
      .get('/months')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res=>{
        expect(res.body).tobe.an('array');
      });
  })
})


describe.skip('GET /api/results', () => {
  it('should return an array of results', () => {
    return supertest(app)
      .get('/api/results')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res=>{
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.lengthOf.at.least(1);
        const result = res.body[0];
        expect(result).to.include.all.keys('month_taken', 'meal_taken','result_read','date_tested','month_id','userid','description', 'diabetestype');
      })
  })
});

// describe.skip('GET /api/users/:user_id', () => {
//   const testUsers = helpers.testUsers();
//   beforeEach('create users, results', async () => {
//     await helpers.createUsers(db, testUsers);
//     await helpers.createResults(db, result_id);
//   });
//   it('returns details on the current user and current cycle', () => {
//     return supertest(app)
//       .get('/api/users/1')
//       .set('Authorization', helpers.createAuthToken(testUsers[0]))
//       .expect(200)
//       .then(res => {
//         expect(res.body.currentUser.username).to.equal(testUsers[0].username);
//         expect(res.body.currentUser.result).to.equal(testUsers[0].result);
        
//       });
//   });
  
// });

