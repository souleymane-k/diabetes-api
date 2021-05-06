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
  //////////
    describe('GET /api/results', () => {
      context(`Given no results`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get('/api/results')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, [])
        })
      })
  
  //     context('Given there are bookmarks in the database', () => {
  //       const testBookmarks = makeBookmarksArray()
  
  //       beforeEach('insert bookmarks', () => {
  //         return db
  //           .into('bookmarks')
  //           .insert(testBookmarks)
  //       })
  
  //       it('gets the bookmarks from the store', () => {
  //         return supertest(app)
  //           .get('/api/bookmarks')
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .expect(200, testBookmarks)
  //       })
  //     })
  //   })
  
  //   describe('GET /api/results/:id', () => {
  //     context(`Given no results`, () => {
  //       it(`responds 404 result doesn't exist`, () => {
  //         return supertest(app)
  //           .get(`/api/results/123`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .expect(404, {
  //             error: { message: `Result Not Found` }
  //           })
  //       })
  //     })
  //   })
  
  //   describe('DELETE /api/results/:id', () => {
  //     context(`Given no results`, () => {
  //       it(`responds 404 result doesn't exist`, () => {
  //         return supertest(app)
  //           .delete(`/api/results/123`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .expect(404, {
  //             error: { message: `Result Not Found` }
  //           })
  //       })
  //     })
  
  //     context('Given there are results in the database', () => {
  //       beforeEach('insert results', () => {
  //         return db
  //           .into('bookmarks')
  //           .insert(diabetes_results)
  //       })
  
  //       it('removes the bookmark by ID from the store', () => {
  //         const idToRemove = 2
  //         const expectedBookmarks = testBookmarks.filter(bm => bm.id !== idToRemove)
  //         return supertest(app)
  //           .delete(`/api/bookmarks/${idToRemove}`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .expect(204)
  //           .then(() =>
  //             supertest(app)
  //               .get(`/api/bookmarks`)
  //               .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //               .expect(expectedBookmarks)
  //           )
  //       })
  //     })
  //   })
  
  //   describe('POST /api/bookmarks', () => {
  //     ['title', 'url', 'rating'].forEach(field => {
  //       const newBookmark = {
  //         title: 'test-title',
  //         url: 'https://test.com',
  //         rating: 2,
  //       }
  
  //       it(`responds with 400 missing '${field}' if not supplied`, () => {
  //         delete newBookmark[field]
  
  //         return supertest(app)
  //           .post(`/api/bookmarks`)
  //           .send(newBookmark)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .expect(400, {
  //             error: { message: `'${field}' is required` }
  //           })
  //       })
  //     })
  
  //     it(`responds with 400 invalid 'rating' if not between 0 and 5`, () => {
  //       const newBookmarkInvalidRating = {
  //         title: 'test-title',
  //         url: 'https://test.com',
  //         rating: 'invalid',
  //       }
  //       return supertest(app)
  //         .post(`/api/bookmarks`)
  //         .send(newBookmarkInvalidRating)
  //         .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //         .expect(400, {
  //           error: { message: `'rating' must be a number between 0 and 5` }
  //         })
  //     })
  
  //     it(`responds with 400 invalid 'url' if not a valid URL`, () => {
  //       const newBookmarkInvalidUrl = {
  //         title: 'test-title',
  //         url: 'htp://invalid-url',
  //         rating: 1,
  //       }
  //       return supertest(app)
  //         .post(`/api/bookmarks`)
  //         .send(newBookmarkInvalidUrl)
  //         .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //         .expect(400, {
  //           error: { message: `'url' must be a valid URL` }
  //         })
  //     })
  
  //     it('adds a new bookmark to the store', () => {
  //       const newBookmark = {
  //         title: 'test-title',
  //         url: 'https://test.com',
  //         description: 'test description',
  //         rating: 1,
  //       }
  //       return supertest(app)
  //         .post(`/api/bookmarks`)
  //         .send(newBookmark)
  //         .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //         .expect(201)
  //         .expect(res => {
  //           expect(res.body.title).to.eql(newBookmark.title)
  //           expect(res.body.url).to.eql(newBookmark.url)
  //           expect(res.body.description).to.eql(newBookmark.description)
  //           expect(res.body.rating).to.eql(newBookmark.rating)
  //           expect(res.body).to.have.property('id')
  //           expect(res.headers.location).to.eql(`/api/bookmarks/${res.body.id}`)
  //         })
  //         .then(res =>
  //           supertest(app)
  //             .get(`/api/bookmarks/${res.body.id}`)
  //             .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //             .expect(res.body)
  //         )
  //     })
  
  //     it('removes XSS attack content from response', () => {
  //       const { maliciousBookmark, expectedBookmark } = makeMaliciousBookmark()
  //       return supertest(app)
  //         .post(`/api/bookmarks`)
  //         .send(maliciousBookmark)
  //         .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //         .expect(201)
  //         .expect(res => {
  //           expect(res.body.title).to.eql(expectedBookmark.title)
  //           expect(res.body.description).to.eql(expectedBookmark.description)
  //         })
  //     })
  //   })
  
  //   describe(`PATCH /api/bookmarks/:bookmark_id`, () => {
  //     context(`Given no bookmarks`, () => {
  //       it(`responds with 404`, () => {
  //         const bookmarkId = 123456
  //         return supertest(app)
  //           .patch(`/api/bookmarks/${bookmarkId}`)
  //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //           .expect(404, { error: { message: `Bookmark Not Found` } })
  //       })
  //     })
  
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
  //     })
    })
  })