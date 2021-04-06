const express = require('express');
 const app = express();
 const STORE = require('../store.json')
 const { PORT } = require('./config')
 const cors = require('cors')



 app.use(express.json());


 const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny': 'common'
  app.use(morgan(morganSetting))
  app.use(cors())

  app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    
    const authToken = req.get("Authorization")
    console.log(apiToken)
    console.log(authToken)
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })



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








 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

app.get('/', (req, res)=>{
  res.json(STORE)

})
app.get('/month', (req, res)=>{
  res.json(months)
})

app.get('/result', (req, res)=>{
  res.json(STORE.results)
})

app.get('/month/:id', (req, res)=>{
  const{id}=req.parasms.id;
  const month = STORE.months.find(m => m.id ==id);

  // make sure we found a month
    if(!month){
      logger.error(`Month with id ${id} not found.`);
      return res
      .status(404)
      .send('Month  Required');
    }
  res.json(month);
});

// app.get('/result/:id', (req, res)=>{
//   const {id} =req.parasms;
//   const result = STORE.results.find(r => r.id ==id);
//     if(!result){
//       return res.send('result Required')
//     }
//   res.json(result)
// })

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
