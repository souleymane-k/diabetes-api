const ResultsService = {
    getAllResults(knex, userid) {
      return knex.select('*').from('diabetes_results')
      .where({userid})
    },
  
    insertResult(knex, newResult) {
      return knex
        .insert(newResult)
        .into('diabetes_results')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('diabetes_results')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteResult(knex, id) {
      return knex('diabetes_results')
        .where({id})
        .delete()
    },
  
    updateResult(knex, id, newResultFields) {
      return knex('diabetes_results')
        .where({ id })
        .update(newResultFields)
    },
  }
  
  module.exports = ResultsService