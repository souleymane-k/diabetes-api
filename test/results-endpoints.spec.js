const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers');

describe('Results Endpoints', () => {
    let db
    let testUsers = helpers.testUsers();
    const testUser = testUsers[0];
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    // after('disconnect from db', () => db.destroy())
    // before('cleanup', () => db('diabetes').truncate())
    // afterEach('cleanup', () => db('diabetes').truncate())

    after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE diabetes_results, diabetes_users, diabetes_months RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE diabetes_results, diabetes_users, diabetes_months RESTART IDENTITY CASCADE'))

    describe('GET /api/results', () => {
      context(`Given no results`, () => {
        it(`responds with 401 and an empty list`, () => {
          return supertest(app)
            .get('/api/results')
            .set('Authorization', `Bearer ${helpers.createAuthToken(testUser)}`)
            .expect(401)
        })
      })
  
      // context('Given there are results in the database', () => {
      //   const testResults = 
      //   beforeEach('insert results', () => {
      //     return db
      //       .into('diabetes_results')
      //       .insert(testResults)
      //   })
  
      //   it('gets the results from the database', () => {
      //     return supertest(app)
      //       .get('/api/results')
      //       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      //       .expect(200, testResults)
      //   })
      // })
    
  
    describe('GET /api/results/:result_id', () => {
      context(`Given no results`, () => {
        it(`responds 404 Result doesn't exist`, () => {
          return supertest(app)
            .get(`/api/results/123`)
            .set('Authorization', `Bearer ${helpers.createAuthToken(testUser)}`)
            .expect(404, {
              error: { message: `Result doesn't exist` }
            })
        })
      })
    })
    //it(`responds 404 result doesn't exist
    describe('DELETE /api/results/:result_id', () => {
      context(`Given no results`, () => {
        it(`responds 404 Result doesn't exist`, () => {
          return supertest(app)
            .delete(`/api/results/123`)
            .set('Authorization', `Bearer ${helpers.createAuthToken(testUser)}`)
            .expect(404, {
              error: { message: `Result doesn't exist` }
            })
        })
      })
  
      context('Given there are results in the database', () => {
        const result = {
          month_taken: 'test-month',
          meal_taken: 'test-meal',
          result_read: 111,
          date_tested: Date,
          month_id: 1,
          userid: 1,
          description: 'test-description',
          diabetestype: 'test-type' 
        }

        beforeEach('insert results', () => {
          return db
            .into('diabetes_results')
            .insert(result)
        })
  
        it('removes the result by ID from the database', () => {
          const idToRemove = 2
          const expectedResults = testResults.filter(bm => bm.id !== idToRemove)
          return supertest(app)
            .delete(`/api/results/${idToRemove}`)
            .set('Authorization', `Bearer ${helpers.createAuthToken(testUser)}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/results`)
                .set('Authorization', `Bearer ${helpers.createAuthToken(testUser)}`)
                .expect(expectedResults)
            )
        })
      })
    })
  



    describe('POST /api/results', () => {
      ['month_taken', 'meal_taken','result_read','date_tested','month_id','userid','description', 'diabetestype'].forEach(field => {
        const newResult = {
          month_taken: 'test-month',
          meal_taken: 'test-meal',
          result_read: 111,
          date_tested: 01-01-21,
          month_id: 1,
          userid: 1,
          description: 'test-description',
          diabetestype: 'test-type' 
        }
  
        it(`responds with 400 missing '${field}' if not supplied`, () => {
          delete newResult[field]
          
          return supertest(app)
            .post(`/api/results`)
            .send(newResult)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(400, {

              error: { message: `Missing '${field}' in request body` }
            })
        })
      })
      //error: { message: `'${field}' is required` }
     //Missing 'diabetestype' in request body
  
      it('adds a new result to the database', () => {
        const newResult = {
          month_taken: 'test-month',
          meal_taken: 'test-meal',
          result_read: 111,
          date_tested: Date,
          month_id: 1,
          userid: 1,
          description: 'test-description',
          diabetestype: 'test-type',
          
        }
        return supertest(app)
          .post(`/api/results`)
          .send(newResult)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.month_taken).to.eql(newResult.month_taken)
            expect(res.body.meal_taken).to.eql(newResult.meal_taken)
            expect(res.body.result_read).to.eql(newResult.result_read)
            expect(res.body.date_tested).to.eql(newResult.date_tested)
            expect(res.body.month_id).to.eql(newResult.month_id)
            expect(res.body.userid).to.eql(newResult.userid)
            expect(res.body.description).to.eql(newResult.description)
            expect(res.body.diabetestype).to.eql(newResult.diabetestype)
            expect(res.headers.location).to.eql(`/api/results/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/results/${res.body.id}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(res.body)
          )
      })
    })
    // ${res.body.id}`)
    describe(`PATCH /api/results/:result_id`, () => {
      context(`Given no results`, () => {
        it(`responds with 404`, () => {
          const resultId = 123456
          return supertest(app)
            .patch(`/api/results/${resultId}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, { error: { message: `Result doesn't exist` } })
        })
      })
      })
    })
  })