require('dotenv').config()
const store = require('../store')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { response } = require('express')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.get('/months', (req, res) =>{
    res.send(store.months)
})

app.get('/', (req, res)=>{
    res.send('Hello, diabetes-api!')
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