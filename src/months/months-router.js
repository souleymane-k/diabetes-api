//const path = require('path')
const express = require('express')

const monthsRouter = express.Router()
// const bodyParser = express.json()

monthsRouter
  .route('/mounths')
  .get((req, res) => {
    // move implementation logic into here
    res.json(STORE.months);
  })


  module.exports = monthsRouter