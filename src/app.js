require('dotenv').config()
// const STORE = require('./store.json')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const monthsRouter = require('./months/months-router')
const resultsRouter = require('./results/results-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const { NODE_ENV } = require('./config')
const { response } = require('express')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())
app.use('/api/months',monthsRouter)
app.use('/api/auth',authRouter)
app.use('/api/results',resultsRouter)
app.use('/api/users',usersRouter)


app.get('/', (req, res)=>{
    // res.json(STORE)
res.send('Hello, diabetes-api!')
})


app.use(function errorHandler(error, req, res, next){
    let response
    if(NODE_ENV ==='production'){
    
        response = {message: error.message.error}
    }else{
        console.error(error)
         response = {message: error.message.error}
    }
    res.status(500).json(response)
})

module.exports = app

