const express = require('express')
const ResultsService = require('./results-service')
// const STORE = require('.../store.json')
const { v4: uuid } = require('uuid');
const resultsRouter = express.Router()
const jsonParser = express.json()


const serializeResult = result => ({
  id: result_id,
  month_taken:result.month_taken,
  meal_taken:result.meal_taken,
  result_read:result.result_read,
  date:result.date,
  month_id:result.month_id,
  userid:result.userid,
  description:result.description,
  diabetesType:result.diabetesType,
})

resultsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ResultsService.getAllResults(knexInstance)
      .then(results => {
        res.json(results.map(serializeResult))
      })
      .catch(next)
  })
  // start here
  .post(jsonParser, (req, res) => {
    const {month_taken, meal_taken, result_read, date,month_id,userid,description,diabetesType} = req.body
    const newResult = { id: uuid(), month_taken, meal_taken, result_read, date,month_id,userid,description,diabetesType}

    for (const [key, value] of Object.entries(newResult))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    ResultsService.insertResult(
      req.app.get('db'),
      newResult
    )
      .then(result => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${result_id}`))
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
    const {month_taken, meal_taken, result_read, date,description,diabetesType} = req.body
    const resultToUpdate = {month_taken, meal_taken, result_read, date,description,diabetesType}
  
    const numberOfValues = Object.values(resultToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          // message: `Request body must contain either 'content' or 'modified'`
          message: `Request body must contain 'month_taken, meal_taken, result_read, date,description,diabetesType'`
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












////////////////////
// resultsRouter
//   .route('/')
//   .get((req, res) => {
//     res.json(STORE.results)
//   })
//   .post(jsonParser, (req, res) => {
//   const {month_taken, meal_taken, result_read, date,month_id,user_id,description,diabetesType} = req.body
//   const newResult = { id: uuid(), month_taken, meal_taken, result_read, date,month_id,user_id,description,diabetesType}
       
//        for (const [key, value] of Object.entries(newResult))
//              if (value == null)
//                return res.status(400).json({
//                  error: { message: `Missing '${key}' in request body` }
//                })
       
//        STORE.results.push(newResult)
       
//        res.status(201)
//            .json(newResult);
   
//   })
  

//   resultsRouter
//   .route('/:result_id')
//   .get((req, res) => {
//     const{result_id}=req.params;
//     const result = STORE.results.find(m => m.id ==result_id);
//     // make sure we found a month
//       if(!result){
//         logger.error(`Result with id ${result_id} not found.`);
//         return res
//         .status(404)
//         .send('Result  Required');
//       }
//     res.json(result);
//   })

//   .delete((req, res) => {
//     // move implementation logic into here
//   const{result_id} = req.params;
//   const resultIndex = STORE.results.findIndex(r =>r.id === result_id) 
  
//   if (resultIndex === -1) {
//     console.log(`result with id ${result_id} not found.`)
   
//     return res
//       .status(404)
//       .send('Result Not Found');
//   }
 
//   STORE.results.splice(resultIndex, 1)

//     res
//       .status(204)
//       .end()

//   })

module.exports = resultsRouter