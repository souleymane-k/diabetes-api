const express = require('express')
const USER = require('../users.json')
const usersRouter = express.Router()
const jsonParser = express.json()


usersRouter
  .route('/users')
  .get((req, res, next) => {
    res.json(USER.users)
  })
  .post(jsonParser, (req, res, next) => {
    const {username,email, password } = req.body
    const newUser = {username,email,password}
  
    for (const [key, value] of Object.entries(newUser)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
  
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
  
    USER.users.push(newUser)
  
    res.status(201)
      .json(newUser);
  
  })

usersRouter
  .route('/users/:user_id')
  .get((req, res) => {
    const{user_id}=req.params;
    const result = USER.users.find(m => m.id ==user_id);
    // make sure we found a month
      if(!result){
        logger.error(`Result with id ${user_id} not found.`);
        return res
        .status(404)
        .send('Result  Required');
      }
    res.json(result);
  })
  .delete((req, res, next) => {
    const{user_id} = req.params;
  const userIndex = USER.users.findIndex(r =>r.id === user_id) 
  
  if (userIndex === -1) {
    console.log(`result with id ${user_id} not found.`)
   
    return res
      .status(404)
      .send('Result Not Found');
  }
 
  USER.users.splice(userIndex, 1)

    res
      .status(204)
      .end()

  })
  

module.exports = usersRouter