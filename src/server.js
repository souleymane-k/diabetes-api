require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const STORE = require('../store.json')
 const { PORT } = require('./config')
const { v4: uuid } = require('uuid');
 const cors = require('cors')
 const jsonParser = express.json()

 const app = express();

 app.use(express.json());


 const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny': 'common'
  app.use(morgan(morganSetting))
  app.use(cors())

  app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    
    const authToken = req.get("Authorization")
    console.log(apiToken)
    console.log(authToken)
  
    next()
  })


 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

app.get('/', (req, res)=>{
  res.json(STORE)

})
app.get('/months', (req, res)=>{
  res.json(STORE.months)
})

app.get('/results', (req, res)=>{
  res.json(STORE.results)
})


app.get('/results/:result_id', (req, res)=>{
  const{result_id}=req.params;
  const result = STORE.results.find(m => m.id ==result_id);
  // make sure we found a month
    if(!result){
      logger.error(`Month with id ${result_id} not found.`);
      return res
      .status(404)
      .send('Result  Required');
    }
  res.json(result);
});


app.get('/months/:month_id', (req, res)=>{
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


app.post(jsonParser, (req, res, next)=>{
 const {monthName, mealName, result, date,monthId,description,dtype} = req.body
const newResult = { id: uuid(), monthName, mealName, result, date,monthId,description,dtype }

for (const [key, value] of Object.entries(newResult))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

STORE.results.push(newResult)

res.status(201)
    .json(newResult);


})

app.delete('/results/:result_id', (req, res)=>{

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





// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
module.exports = {app};


