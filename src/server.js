const express = require('express');
 const app = express();

//  const PORT = process.env.PORT || 3000;

 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });
 app.get('/', (req, res)=>{
  res.send('Hello, diabetes-api!')
})
app.get('/months', (req, res)=>{
  res.json('store.months')
})

//  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//  module.exports = {app};






// const app = require('./app')
const { PORT } = require('./config')

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
module.exports = {app};