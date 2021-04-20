require("dotenv").config();
const knex=require('knex');
const app = require('./app')
const morgan = require('morgan')
const { PORT, DATABASE_URL } = require('./config')
const cors = require('cors')



//  const app = express();


 const {CLIENT_ORIGIN} = require('./config');
 app.use(
     cors({
         origin: CLIENT_ORIGIN
     })
 );

 const db = knex({
    client: 'pg',
     connection: DATABASE_URL,
})

app.set("db", db);


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



