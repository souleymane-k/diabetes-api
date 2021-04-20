require('dotenv').config()
const STORE = require('./store.json')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const monthsRouter = require('./months/months-router')
const resultsRouter = require('./results/results-router')
const usersRouter = require('./users/users-router')

const { NODE_ENV } = require('./config')
const { response } = require('express')


const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())
app.use(cors())
app.use(express.json());

app.use('/api/months',monthsRouter)
app.use('/api/results',resultsRouter)
app.use('/api/users',usersRouter)


app.get('/', (req, res)=>{
    // res.json(STORE)
res.send('Hello, diabetes-api!')
})

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })



app.use(function errorHandler(error, req, res, next){
    let response
    if(NODE_ENV ==='production'){
        response = { error: { message: 'server error' } }
    }else{
        console.error(error)
        response = {message: error.message.error}
    }
    res.status(500).json(response)
})

module.exports = app