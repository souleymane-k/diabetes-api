const express = require('express');
 const app = express();
 const STORE = require('../store.json')
 const { PORT } = require('./config')


 app.use(express.json());
//  app.use('/api', Anyroute)

//  const PORT = process.env.PORT || 3000;

const months = [
{
  "id":1,
  "name":"January"
},
{
  "id":2,
  "name":"February"
},
{
  "id":3,
  "name":"March"
}]








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
  const{id}=req.parasms;
  const month = months.find(m => m.id ==id);
    if(!month){
      return res.send('Month Required')
    }
  res.json(month)
})

app.get('/result/:id', (req, res)=>{
  const {id} =req.parasms;
  const result = STORE.results.find(r => r.id ==id);
    if(!result){
      return res.send('result Required')
    }
  res.json(result)
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
