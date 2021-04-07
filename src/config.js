require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8001,
    NODE_ENV: process.env.NODE_ENV || 'production',
    API_TOKEN: process.env.API_TOKEN || '0d0e1dbb-8d52-49f0-9dbf-570ec4f5109a',
    //DATABASE_URL: process.env.DATABASE_URL || 'postgres://emrwbvujwlxffo:4b9b0a57f6fc57f846c77db82847b0310e354c98c4ca4bac57664c3ebf40d976@ec2-54-211-77-238.compute-1.amazonaws.com:5432/d9ulrv9qnqc0hm',
  }

