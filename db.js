require("dotenv");

const obj = {
  client: "postgresql",
  connection: {
    host: process.env.host,
    port: 5432,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    ssl: true
  }
};

const knex = require("knex")(obj);

module.exports = knex;
