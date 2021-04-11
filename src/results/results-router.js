const express = require('express')
const STORE = require('./store.json')
const { v4: uuid } = require('uuid');

const resultsRouter = express.Router()
const bodyParser = express.json()


resultsRouter
  .route('/results')
  .get((req, res) => {
    res.json(STORE.results)
  })
  .post(bodyParser, (req, res) => {
  const {monthName, mealName, result, date,monthId,description,dtype} = req.body
  const newResult = { id: uuid(), monthName, mealName, result, date,monthId,description,dtype}
       
       for (const [key, value] of Object.entries(newResult))
             if (value == null)
               return res.status(400).json({
                 error: { message: `Missing '${key}' in request body` }
               })
       
       STORE.results.push(newResult)
       
       res.status(201)
           .json(newResult);
   
  })

  resultsRouter
  .route('/results/result_id')
  .get((req, res) => {
    const{result_id}=req.params;
    const result = STORE.results.find(m => m.id ==result_id);
    // make sure we found a month
      if(!result){
        logger.error(`Result with id ${result_id} not found.`);
        return res
        .status(404)
        .send('Result  Required');
      }
    res.json(result);
  })

  .delete((req, res) => {
    // move implementation logic into here
  const{result_id} = req.params;
  const resultIndex = STORE.results.findIndex(r =>r.id === result_id) 
  
  if (resultIndex === -1) {
    console.log(`result with id ${result_id} not found.`)
   
    return res
      .status(404)
      .send('Result Not Found');
  }
 
  STORE.results.splice(resultIndex, 1)

    res
      .status(204)
      .end()

  })

module.exports = resultsRouter