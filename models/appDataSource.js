const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dateStrings: process.env.DB_DATESTRINGS,
  database: process.env.DB_DATABASE,
  dateStrings: process.env.DB_DATESTRINGS,
});

module.exports = appDataSource;
