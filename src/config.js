require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8001,
    NODE_ENV: process.env.NODE_ENV || 'production',
    CLIENT_ORIGIN:'https://diabetes-ms-3skoas3bd-souleymane-k.vercel.app',
    API_TOKEN: process.env.API_TOKEN || '0d0e1dbb-8d52-49f0-9dbf-570ec4f5109a',
    // DATABASE_URL:"postgresql://dunder_mifflin:hello@localhost/dt1ic1skh40v7",
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://nxsaeoebktnywn:65fed28864db212bc7eadc7ae916c6a1809f6049843c8ea32144a24a07dcbecb@ec2-54-211-176-156.compute-1.amazonaws.com:5432/dt1ic1skh40v7',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://dunder_mifflin:hello@localhost/diabetes-test"
  }

