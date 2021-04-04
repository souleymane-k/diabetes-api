const express = require('express');
 const app = express();
 const store = require('./store.json')

//  const PORT = process.env.PORT || 3000;

 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });



 app.get('/', (req, res)=>{
  res.send('Hello, diabetes-api!')
})
/////get months////

app.get('/months', function handleMonths(req, res) {
  let response = store.months;

  // filter our pokemon by name if name query param is present
  if (req.query.name) {
    response = response.filter(months =>
      // case insensitive searching
      months.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
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