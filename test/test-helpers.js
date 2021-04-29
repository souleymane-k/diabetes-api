'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ResultsService = require('../src/results/result-service');
//workouts = results
function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      results,
      RESTART IDENTITY CASCADE
    `
  );
}

function createAuthToken(user, secret=process.env.JWT_SECRET, expiry=process.env.JWT_EXPIRY) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    expiresIn: expiry,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

function createNewUserRequest() {
  return {
    username: 'foo bar',
    email: 'foo@bar.com',
    password: '123456',
    
  };
}

function createUsers(db, users) {
  const preppedUsers = users.map(user => {
    return {...user, password: bcrypt.hashSync(user.password, 1)};
  });

  return db('users')
    .insert(preppedUsers)
    .returning('*')
    .then(rows => rows);
}

function findByEmail(db, email) {
  return db('users').where({email}).first('*');
}

async function createResults(db, result_id) {
  const results = await ResultsService.createResults(result_id);
  return db('results')
    .insert(results)
    .returning('*')
    .then(rows => rows);
}

function findResultById(db, id) {
  return db('results').where({id}).first('*');
}


module.exports = {
  cleanTables,
  createAuthToken,
  createNewUserRequest,
  createUsers,
  findByEmail,
  createResults,
  findResultById,
};