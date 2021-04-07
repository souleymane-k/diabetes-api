require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
 const STORE = require('../store.json')
 const { PORT } = require('./config')
const { v4: uuid } = require('uuid');
 const cors = require('cors')
 //const bodyParser = express.json()
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
  
    // if (!authToken || authToken.split(' ')[1] !== apiToken) {
    //   return res.status(401).json({ error: 'Unauthorized request' })
    // }
    // move to the next middleware
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
// .then(result => {
//   res
//     .status(201)
//     .location(path.posix.join(req.originalUrl, `/${result.id}`))
//     .json(result)
// })
// .catch(next)
res.status(201)
    .json(newResult);


// logger.info(`Result with id ${result.id} created`)
//     res
//       .status(201)
//       .location(`http://localhost:8001/results/${result.id}`)
//       .json(ReqInput)

//    .catch(next)
})

app.delete('/results/:result_id', (req, res)=>{
  const{result_id} = req.params;

  const resultIndex = STORE.results.findIndex(r =>r.id === result_id) 
  
  if (resultIndex === -1) {
    console.log(`result with id ${result_id} not found.`)
    // logger.error(`result with id ${result_id} not found.`)
    return res
      .status(404)
      .send('Result Not Found');
  }
 
  STORE.results.splice(resultIndex, 1)
  
  // logger.info(`result with id ${result_id} deleted.`)
  //   res
  //     .status(204)
  //     .end()

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





// app.get('/months', function getMonths(req, res) {
//   let response = STORE.months;

//   // filter our pokemon by name if name query param is present
//   if (req.query.name) {
//     response = response.filter(months =>
//       // case insensitive searching
//       months.name.toLowerCase().includes(req.query.name.toLowerCase())
//     )
//   }

//   //filter our pokemon by type if type query param is present
//   if (req.query.types) {
//     response = response.filter(pokemon =>
//       pokemon.type.includes(req.query.types)
//       //req.query.types
//     )
//   }

// const months = [
// {
//   "id":1,
//   "name":"January"
// },
// {
//   "id":2,
//   "name":"February"
// },
// {
//   "id":3,
//   "name":"March"
// }]


// for(const field of ['monthName','mealName','result','date','monthId','description','dtype']){
  //   if (!req.body[field]) {
  //     logger.error(`${field} is required`)
  //     return res.status(400).send(`'${field}' is required`)
  // }
// }



// if (!monthName) {
//   logger.error(`Invalid monthName '${monthName}' is required`)
//   return res.status(400).send(`'monthName' is required`)
// }
// if (!mealhName) {
//   logger.error(`Invalid monthName '${mealName}' is required`)
//   return res.status(400).send(`'mealName' is required`)
// }
// if (!Number.isInteger(result) || result < 0 || result > 500) {
//   logger.error(`Invalid result '${result}' supplied`)
//   return res.status(400).send(`'result' must be a number between 60 and 400`)
// }
// if (!date) {
//   logger.error(`Invalid date '${date}' is required`)
//   return res.status(400).send(`'date' is required`)
// }
// if (!Number.isInteger(monthId) || monthId < 1 || rating > 12) {
//   logger.error(`Invalid monthId '${monthId}' supplied`)
//   return res.status(400).send(`'monthId' must be a number between 1 and 12`)
// }
// if (!description) {
//   logger.error(`Invalid description '${description}' is required`)
//   return res.status(400).send(`'description' is required`)
// }
// if (!dtype) {
//   logger.error(`Invalid dtype '${dtype}' is required`)
//   return res.status(400).send(`'dtype' is required`)
// }
