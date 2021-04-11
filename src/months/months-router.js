//const path = require('path')
const express = require('express')
const STORE = require('../store.json')

const monthsRouter = express.Router()
// const bodyParser = express.json()

monthsRouter
  .route('/months')
  .get((req, res) => {
    // move implementation logic into here
    res.json(STORE.months);
  })


  module.exports = monthsRouter