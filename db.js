require("dotenv").config();

const prod = {
  client: "postgresql",
  connection: {
    host: process.env.host,
    port: 5432,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    ssl: false
  }
};

const backup = {
  client: "postgresql",
  connection: {
    host: "safubackupbackup.cvdzhktav8eh.us-west-1.rds.amazonaws.com",
    port: 5432,
    database: "safubackupbackup",
    user: "safubackupbackupadmin",
    password: "safubackupbackup!",
    ssl: false
  }
};

const knex = require("knex")(backup);

module.exports = knex;
