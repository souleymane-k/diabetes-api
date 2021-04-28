const path = require('path')
const express = require('express')
const UsersService = require('./users-service')
//const USER = require('../users.json')
const { v4: uuid } = require('uuid');
const usersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUser = user => ({
  id: user_id,
  username: user.username,
  email: user.email,
  password: user.password,
})
usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const {username, email, password} = req.body

    for (const field of ['username', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      
   // TODO: check username doesn't start with spaces
   const passwordError = UsersService.validatePassword(password)

   if (passwordError)
     return res.status(400).json({ error: passwordError })

   UsersService.hasUserWithUserName(
     req.app.get('db'),
     username
   )
     .then(hasUserWithUserName => {
       if (hasUserWithUserName)
         return res.status(400).json({ error: `Username already taken` })

       return UsersService.hashPassword(password)
         .then(hashedPassword => {
           const newUser = {
             username,
             email,
             password: hashedPassword,
            //  date_created: 'now()',
           }

           
           return UsersService.insertUser(
             req.app.get('db'),
             newUser
           )
             .then(user => {
               res
                 .status(201)
                 .location(path.posix.join(req.originalUrl, `/${user.id}`))
                 .json(UsersService.serializeUser(user))
             })
         })
     })
     .catch(next)
 })
usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    UsersService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user))
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const {username, email,password } = req.body
    const userToUpdate = {username,email, password }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'username', 'password'`
        }
      })

    UsersService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  module.exports = usersRouter

// {
//   "id": 1,
//   "fullname": "Meite Mamadou",
//   "username": "emit.gamgee@shire.com",
//   "password": "secret",
//   "confirm_password": "secret"
// }










//////
// usersRouter
//   .route('/')
//   .get((req, res, next) => {
//     res.json(USER.users)
//   })
//   .post(jsonParser, (req, res, next) => {
//     const {username,email,password } = req.body
//     const newUser = {id: uuid(),username,email,password}
  
//     for (const [key, value] of Object.entries(newUser)) {
//       if (value == null) {
//         return res.status(400).json({
//           error: { message: `Missing '${key}' in request body` }
//         })
//       }
//     }
  
//     newUser.username = username;
//     newUser.email = email;
//     newUser.password = password;
  
//     USER.users.push(newUser)
  
//     res.status(201)
//       .json(newUser);
  
//   })

// usersRouter
//   .route('/:user_id')
//   .get((req, res) => {
//     const{user_id}=req.params;
//     const result = USER.users.find(m => m.id ==user_id);
//     // make sure we found a month
//       if(!result){
//         logger.error(`Result with id ${user_id} not found.`);
//         return res
//         .status(404)
//         .send('Result  Required');
//       }
//     res.json(result);
//   })
//   .delete((req, res, next) => {
//     const{user_id} = req.params;
//   const userIndex = USER.users.findIndex(r =>r.id === user_id) 
  
//   if (userIndex === -1) {
//     console.log(`result with id ${user_id} not found.`)
   
//     return res
//       .status(404)
//       .send('Result Not Found');
//   }
 
//   USER.users.splice(userIndex, 1)

//     res
//       .status(204)
//       .end()

//   })


          // newUser.username = usernamve;
          //  newUser.email = email;
          //  newUser.password= password;
  



