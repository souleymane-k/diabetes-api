const usersService = {
    getAllUsers(knex) {
      return knex.select('*').from('diabetes_users')
    },
  
    insertUser(knex, newUser) {
      return knex
        .insert(newUser)
        .into('diabetes_users')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('diabetes_users')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteUser(knex, id) {
      return knex('diabetes_users')
        .where({id})
        .delete()
    },
  
    updateUser(knex, id, newUserFields) {
      return knex('diabetes_users')
        .where({ id })
        .update(newUserFields)
    },
  }
  
  module.exports = usersService