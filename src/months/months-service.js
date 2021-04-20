const monthsService = {
    getAllMonths(knex) {
      return knex.select('*').from('diabetes_months')
    },
  
    // insertMonth(knex, newMonth) {
    //   return knex
    //     .insert(newMonth)
    //     .into('diabetes_months')
    //     .returning('*')
    //     .then(rows => {
    //       return rows[0]
    //dt1ic1skh40v7
    //     })
    // },
  
    getById(knex, id) {
      return knex
        .from('diabetes_months')
        .select('*')
        .where('id', id)
        .first()
    },
  
    // deleteMonth(knex, id) {
    //   return knex('diabetes_months')
    //     .where({id})
    //     .delete()
    // },
  
    updateMonth(knex, id, newMonthFields) {
      return knex('diabetes_months')
        .where({ id })
        .update(newMonthFields)
    },
  }
  
  module.exports = monthsService