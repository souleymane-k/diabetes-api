const express = require('express')
const ResultsService = require('./results-service')
const { requireAuth } = require('../middleware/jwt-auth')
// const STORE = require('.../store.json')
//const { v4: uuid } = require('uuid');

const resultsRouter = express.Router()
const jsonParser = express.json()


const serializeResult = result => ({
  id: result.id,
  meal_taken: result.meal_taken,
  result_read: result.result_read,
  date_tested: result.date_tested,
  month_taken: result.month_taken,
  userid: result.userid,
  description: result.description,
  diabetestype: result.diabetestype,
})

resultsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db')
    ResultsService.getAllResults(knexInstance, req.user.id)
      .then(results => {
        res.json(results.map(serializeResult))
      })
      .catch(next)
  })
  .post(jsonParser, requireAuth, (req, res, next) => {
    const {meal_taken, result_read,date_tested, month_taken,description, diabetestype } = req.body
    const newResult = { meal_taken, result_read,date_tested, month_taken,description, diabetestype }
    //month_id, userid,
    for (const [key, value] of Object.entries(newResult))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })


    newResult.userid = req.user.id;


    ResultsService.insertResult(
      req.app.get('db'),
      newResult
    )
      .then(result => {
        res
          .status(201)
          // .location(path.posix.join(req.originalUrl, `/${result.id}`))
          .json(serializeResult(result))
      })
      .catch(next)
  })

resultsRouter
  .route('/:result_id')
  .all((req, res, next) => {
    ResultsService.getById(
      req.app.get('db'),
      req.params.result_id
    )
      .then(result => {
        if (!result) {
          return res.status(404).json({
            error: { message: `Result doesn't exist` }
          })
        }
        res.result = result
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeResult(res.result))
  })
  .delete((req, res, next) => {
    ResultsService.deleteResult(
      req.app.get('db'),
      req.params.result_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { meal_taken,result_read, date_tested,month_taken, description, diabetestype } = req.body
    const resultToUpdate = {meal_taken, result_read, date_tested, month_taken,description, diabetestype }

    const numberOfValues = Object.values(resultToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          // message: `Request body must contain either 'content' or 'modified'`
          message: `Request body must contain 'month_taken, meal_taken, result_read, date_tested,description,diabetestype'`
        }
      })

    ResultsService.updateResult(
      req.app.get('db'),
      req.params.result_id,
      resultToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })


module.exports = resultsRouter