const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe('Results Endpoints', () => {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => db('diabetes').truncate())
    afterEach('cleanup', () => db('diabetes').truncate())



    describe(`Unauthorized requests`, () => { 
      let testResults = []
      beforeEach('insert results', () => {
        return db
          .into('results')
          .insert(testResults)
      })
      it(`responds with 401 Unauthorized for GET /api/results`, () => {
        return supertest(app)
          .get('/api/results')
          .expect(401, { error: 'Unauthorized request' })
      })
  
      it(`responds with 401 Unauthorized for POST /api/results`, () => {
        return supertest(app)
          .post('/api/results')
          .send({ })
          .expect(401, { error: 'Unauthorized request' })
      })

  
      it(`responds with 401 Unauthorized for GET /api/results/:result_id`, () => {
        
        return supertest(app)
          .get(`/api/results/${result_id}`)
          .expect(401, { error: 'Unauthorized request' })
      })
  
      it(`responds with 401 Unauthorized for DELETE /api/results/:result_id`, () => {
        return supertest(app)
          .delete(`/api/results/${result_id}`)
          .expect(401, { error: 'Unauthorized request' })
      })
  
      it(`responds with 401 Unauthorized for PATCH /api/results/:result_id`, () => {
        return supertest(app)
          .patch(`/api/results/${result_id}`)
          .send({})
          .expect(401, { error: 'Unauthorized request' })
      })
    })
  
    describe('GET /api/results', () => {
      context(`Given no results`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get('/api/results')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, [])
        })
      })
  
      context('Given there are results in the database', () => {
        const testResults = []
  
        beforeEach('insert results', () => {
          return db
            .into('diabetes_results')
            .insert(testResults)
        })
  
        it('gets the results from the database', () => {
          return supertest(app)
            .get('/api/bookmarks')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, testResults)
        })
      })
    
  
    describe('GET /api/results/:result_id', () => {
      context(`Given no results`, () => {
        it(`responds 404 result doesn't exist`, () => {
          return supertest(app)
            .get(`/api/results/123`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, {
              error: { message: `Result Not Found` }
            })
        })
      })
    })
  
    describe('DELETE /api/results/:result_id', () => {
      context(`Given no results`, () => {
        it(`responds 404 result doesn't exist`, () => {
          return supertest(app)
            .delete(`/api/results/123`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, {
              error: { message: `Result Not Found` }
            })
        })
      })
  
      context('Given there are results in the database', () => {
        beforeEach('insert results', () => {
          return db
            .into('diabetes_results')
            .insert(results)
        })
  
        it('removes the result by ID from the database', () => {
          const idToRemove = 2
          const expectedResults = testResults.filter(bm => bm.id !== idToRemove)
          return supertest(app)
            .delete(`/api/results/${idToRemove}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/results`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
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
          date_tested: 01-01-21,
          month_id: 1,
          userid: 1,
          description: 'test-description',
          diabetestype: 'test-type',
          
        }
  
        it(`responds with 400 missing '${field}' if not supplied`, () => {
          delete newResult[field]
  
          return supertest(app)
            .post(`/api/results`)
            .send(newResult)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(400, {
              error: { message: `'${field}' is required` }
            })
        })
      })
  
  
      it('adds a new result to the database', () => {
        const newResult = {
          month_taken: 'test-month',
          meal_taken: 'test-meal',
          date_tested: 01-01-21,
          month_id: 1,
          userid: 1,
          description: 'test-description',
          diabetestype: 'test-type',
          
        }
        return supertest(app)
          .post(`/api/bookmarks`)
          .send(newResult)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(201)
          .expect(res => {
            expect(res.body.month_taken).to.eql(newBookmark.month_taken)
            expect(res.body.meal_taken).to.eql(newResult.meal_taken)
            expect(res.body.date_tested).to.eql(newResult.date_tested)
            expect(res.body.month_id).to.eql(newResult.month_id)
            expect(res.body.userid).to.eql(newResult.userid)
            expect(res.body.description).to.eql(newResult.description)
            expect(res.body.diabetestype).to.eql(newResult.diabetestype)
            expect(res.body).to.have.property('id')
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
  
    describe(`PATCH /api/results/:result_id`, () => {
      context(`Given no results`, () => {
        it(`responds with 404`, () => {
          const resultId = 123456
          return supertest(app)
            .patch(`/api/bookmarks/${resultId}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, { error: { message: `Result Not Found` } })
        })
      })
  
  //     context('Given there are bookmarks in the database', () => {
  //       const testBookmarks = makeBookmarksArray()
  
  //       beforeEach('insert bookmarks', () => {
  //         return db
  //           .into('bookmarks')
  //           .insert(testBookmarks)
  //       })
  
  //       it('responds with 204 and updates the bookmark', () => {
  //         const idToUpdate = 2
  //         const updateBookmark = {
  //           title: 'updated bookmark title',
  //           url: 'https://updated-url.com',
  //           description: 'updated bookmark description',
  //           rating: 1,
  //         }
  //         const expectedArticle = {
  //           ...testBookmarks[idToUpdate - 1],
  //           ...updateBookmark
  //         }
  //         return supertest(app)
  //           .patch(`/api/bookmarks/${idToUpdate}`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .send(updateBookmark)
  //           .expect(204)
  //           .then(res =>
  //             supertest(app)
  //               .get(`/api/bookmarks/${idToUpdate}`)
  //               .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //               .expect(expectedArticle)
  //           )
  //       })
  
  //       it(`responds with 400 when no required fields supplied`, () => {
  //         const idToUpdate = 2
  //         return supertest(app)
  //           .patch(`/api/bookmarks/${idToUpdate}`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .send({ irrelevantField: 'foo' })
  //           .expect(400, {
  //             error: {
  //               message: `Request body must content either 'title', 'url', 'description' or 'rating'`
  //             }
  //           })
  //       })
         
  //       it(`responds with 204 when updating only a subset of fields`, () => {
  //         const idToUpdate = 2
  //         const updateBookmark = {
  //           title: 'updated bookmark title',
  //         }
  //         const expectedBookmark = {
  //           ...testBookmarks[idToUpdate - 1],
  //           ...updateBookmark
  //         }
  
  //         return supertest(app)
  //           .patch(`/api/bookmarks/${idToUpdate}`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .send({
  //             ...updateBookmark,
  //             fieldToIgnore: 'should not be in GET response'
  //           })
  //           .expect(204)
  //           .then(res =>
  //             supertest(app)
  //               .get(`/api/bookmarks/${idToUpdate}`)
  //               .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //               .expect(expectedBookmark)
  //           )
  //       })
  
  //       it(`responds with 400 invalid 'rating' if not between 0 and 5`, () => {
  //         const idToUpdate = 2
  //         const updateInvalidRating = {
  //           rating: 'invalid',
  //         }
  //         return supertest(app)
  //           .patch(`/api/bookmarks/${idToUpdate}`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .send(updateInvalidRating)
  //           .expect(400, {
  //             error: {
  //               message: `'rating' must be a number between 0 and 5`
  //             }
  //           })
  //       })
  
  //       it(`responds with 400 invalid 'url' if not a valid URL`, () => {
  //         const idToUpdate = 2
  //         const updateInvalidUrl = {
  //           url: 'htp://invalid-url',
  //         }
  //         return supertest(app)
  //           .patch(`/api/bookmarks/${idToUpdate}`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .send(updateInvalidUrl)
  //           .expect(400, {
  //             error: {
  //               message: `'url' must be a valid URL`
  //             }
  //           })
  //       })
      })
    })
  })