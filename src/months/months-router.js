const path = require('path')
const express = require('express')
//const STORE = require('../store.json')
const MonthsService = require('./months-service')

const monthsRouter = express.Router()
 //const jsonParser = express.json()


 const serializeMonth = month => ({
  id: month_id,
  month_taken: month.month_taken,
})
monthsRouter
  .route('/')
  .get((req, res, next) => {
    console.log('FINDING ALL MONTHS');
    const knexInstance = req.app.get('db')
    MonthsService.getAllMonth(knexInstance)
      .then(months => {
        res.json(months.map(serializeMonth))
      })
      .catch(next)
  })

  monthsRouter
  .route('/:month_id')
  .all((req, res, next) => {
    MonthsService.getById(
      req.app.get('db'),
      req.params.month_id
    )
      .then(month => {
        if (!month) {
          return res.status(404).json({
            error: { message: `Month doesn't exist` }
          })
        }
        res.month = month
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeMonth(res.month))
  })






////////////////////////////////
  // monthsRouter
  // .route('/')
  // .get((req, res) => {
  //   // move implementation logic into here
  //   res.json(STORE.months);
  // })
  // .post(jsonParser, (req, res) => {
  //   const {month_taken, } = req.body
  //   const newMonth = { id: uuid(), month_taken}
         
  //        for (const [key, value] of Object.entries(newMonth))
  //              if (value == null)
  //                return res.status(400).json({
  //                  error: { message: `Missing '${key}' in request body` }
  //                })
         
  //        STORE.months.push(newMonth)
         
  //        res.status(201)
  //            .json(newMonth);
     
  //   })


  // monthsRouter
  // .route('/:month_id')
  // .get((req, res)=>{
  //     const{month_id}=req.params;
  //     const month = STORE.months.find(m => m.id ==month_id);
  //     // make sure we found a month
  //       if(!month){
  //         logger.error(`Month with id ${month_id} not found.`);
  //         return res
  //         .status(404)
  //         .send('Month  Required');
  //       }
  //     res.json(month);
  //   })
    // .delete((req, res) => {
    //   // move implementation logic into here
    // const{month_id} = req.params;
    // const monthIndex = STORE.months.findIndex(r =>r.id === month_id) 
    
    // if (monthIndex === -1) {
    //   console.log(`result with id ${month_id} not found.`)
     
    //   return res
    //     .status(404)
    //     .send('Month Not Found');
    // }
   
    // STORE.months.splice(monthIndex, 1)
  
    //   res
    //     .status(204)
    //     .end()
  
    // })


  module.exports = monthsRouter