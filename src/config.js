require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8001,
    NODE_ENV: process.env.NODE_ENV || 'production',
    CLIENT_ORIGIN:'https://diabetes-ms-3skoas3bd-souleymane-k.vercel.app/',
    API_TOKEN: process.env.API_TOKEN || '0d0e1dbb-8d52-49f0-9dbf-570ec4f5109a',
    DATABASE_URL:"postgresql://dunder_mifflin:hello@localhost/diabetes",
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://dunder_mifflin:hello@localhost/diabetes-test"
  }

