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
  context(`Given no months`, () => {
    it(`responds with 200 and an empty list`, () => {
      return supertest(app)
        .get('/months')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, [])
    })

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

