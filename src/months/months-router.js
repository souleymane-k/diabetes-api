//const path = require('path')
const express = require('express')
const STORE = require('../store.json')

const monthsRouter = express.Router()
// const bodyParser = express.json()

// monthsRouter
//   .route('/api/months')
//   .get((req, res) => {
//     // move implementation logic into here
//     res.json(STORE.months);
//   })

  monthsRouter
  .route('/')
  .get((req, res) => {
    // move implementation logic into here
    res.json(STORE.months);
  })


  monthsRouter
  .route('/:month_id')
  .get((req, res)=>{
      const{month_id}=req.params;
      const month = STORE.months.find(m => m.id ==month_id);
      // make sure we found a month
        if(!month){
          logger.error(`Month with id ${month_id} not found.`);
          return res
          .status(404)
          .send('Month  Required');
        }
      res.json(month);
    });


//route('/api/months/:month_id')

  module.exports = monthsRouter