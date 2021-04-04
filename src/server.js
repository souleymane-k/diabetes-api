const express = require('express');
 const app = express();
 const STORE = require('../store.json')

//  const PORT = process.env.PORT || 3000;

 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

//  app.get('/', (req, res)=>{
//   res.send('Hello, diabetes-api!')
// })
app.get('/', (req, res)=>{
  res.json(STORE)

})
app.get('/months', (req, res)=>{
  res.json(STORE.months)

})
app.get('/month/:id', (req, res)=>{
  const{id}=req.parasms;
  const month = months.find(c => c.id ==id);
    if(!month){
      return res.send('Month Required')
    }
  res.json(month)
  // res.json(STORE.results)
})

app.get('/results', (req, res)=>{
  res.json(STORE.results)
})
app.get('/result/:id', (req, res)=>{
  const{id}=req.parasms;
  const result = results.find(c => c.id ==id);
    if(!result){
      return res.send('result Required')
    }
  res.json(result)
  // res.json(STORE.results)
})

// app.get('/results/:result_id', (req, res, next)=>{
//   let response = STORE.results;
//   if (req.query.result_id){
//     response = response.filter(results =>
//       // case insensitive searching
//       results.name.toLowerCase().includes(req.query.name.toLowerCase())
//     )
//   }

//       req.app.get(STORE.results),
//       req.params.folder_id

//   // res.send(req.params)
//   // res.json(STORE.results)
//   res.json(result_id)
// })


/////get months////

app.get('/months', function getMonths(req, res) {
  let response = STORE.months;

  // filter our pokemon by name if name query param is present
  if (req.query.name) {
    response = response.filter(months =>
      // case insensitive searching
      months.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

  //filter our pokemon by type if type query param is present
  if (req.query.types) {
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.types)
      //req.query.types
    )
  }

  res.json(response)
})

// app.get('/months', (req, res)=>{
//   res.json('store.months')
// })

//  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//  module.exports = {app};






// const app = require('./app')
const { PORT } = require('./config')

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
module.exports = {app};