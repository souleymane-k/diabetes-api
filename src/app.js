const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()
const resultsRouter = require('./results/results-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const { NODE_ENV } = require('./config')
const { response } = require('express')
const {CLIENT_ORIGIN} = require('./config');

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())

app.use(
    cors({
        origin: CLIENT_ORIGIN || '*'
    })
);




app.use('/api/results',resultsRouter)
app.use('/api/auth',authRouter)
app.use('/api/users',usersRouter)


app.get('/', (req, res)=>{
    // res.json(STORE)
res.send('Hello, diabetes-api!')
})


app.use(function errorHandler(error, req, res, next){
    let response
    console.error(error)
    if(NODE_ENV ==='production'){
    
        response = {message: error.message.error}
    }else{
        
         response = {message: error.message.error}
    }
    res.status(500).json(response)
})

module.exports = app

