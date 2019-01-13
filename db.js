require("dotenv").config();

const prod = {
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

const knex = require("knex")(prod);

module.exports = knex;
