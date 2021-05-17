const bcrypt = require('bcryptjs')
 const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUserWithUserName(db, username) {
    return db('diabetes_users')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('diabetes_users')
      .returning('*')
      .then(([user]) => user)
  },
  // validateUsername(username) {
  //   if (username) {
  //     return 'username cannot begin or end with spaces'
  //   }
  // },

  // validateEmail(email) {
  //   if (!email) {
  //     return 'email cannot begin or end with spaces'
  //   }
  // },

  // validateUsername(username) {
  //   const response = {};
  //   if (username.length < 3) {
  //     response.error = 'username must be at least 3 characters';
  //   } else if (username.trim().indexOf(' ') === -1)
  //     response.error = 'username cannot begin or end with spaces';
  //   return response;
  // },

  // validateEmail(email) {
  //   const response = {};
  //   if (!/\S+@\S+/.test(email)) {
  //     response.error = 'invalid email format';
  //   }
  //   return response;
  // },

  // validatePassword(password) {
  //   const response = {};
  //   if (password.length < 6) {
  //     response.error = 'password must be at least 6 characters';
  //   }
  //   return response;
  // },




  /////
  validatePassword(password) {
    if (password.length < 8) {
      // return 'password cannot begin or end with spaces'
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },

  serializeUser(user) {
    return {
      id: user.id,
      email: xss(user.email),
      username: xss(user.username),
    }
  },
}

module.exports = UsersService









//////
// const usersService = {
//     getAllUsers(knex) {
//       return knex.select('*').from('diabetes_users')
//     },
  
//     insertUser(knex, newUser) {
//       return knex
//         .insert(newUser)
//         .into('diabetes_users')
//         .returning('*')
//         .then(rows => {
//           return rows[0]
//         })
//     },
    
//     getById(knex, id) {
//       return knex
//         .from('diabetes_users')
//         .select('*')
//         .where('id', id)
//         .first()
//     },
  
//     deleteUser(knex, id) {
//       return knex('diabetes_users')
//         .where({id})
//         .delete()
//     },
  
//     updateUser(knex, id, newUserFields) {
//       return knex('diabetes_users')
//         .where({ id })
//         .update(newUserFields)
//     },
//   }
  
//   module.exports = usersService