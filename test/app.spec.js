const { expect } = require('chai')
 const supertest = require('supertest');
const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "Hello, diabetes-api!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, diabetes-api!')
  })

})
describe('GET /months', () => {
  it('should return an array of months', () => {
    return supertest(app)
      .get('/months')
      .expect(200)
      .expect('Content-Type', /json/);\
      .then(res=>{
        expect(res.body).tobe.an('array');
      });
  })
})



describe('GET /results', () => {
  // it('should return an array of results', () => {
  //   return supertest(app)
  //     .get('/results')
  //     .expect(200)
  //     .expect('Content-Type', /json/)
  //     .then(res=>{
  //       expect(res.body).to.be.an('array');
  //       expect(res.body).to.have.lengthOf.at.least(1);
  //       const result = res.body[0];
  //       expect(result).to.include.all.keys(
  //                  'monthName','mealName','result','monthId:','description',' dtype'
  //                );
  //     })
  // })
});

