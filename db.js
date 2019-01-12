const obj = {
  client: "postgresql",
  connection: {
    host: "safuburnrate.cvdzhktav8eh.us-west-1.rds.amazonaws.com",
    port: 5432,
    database: "safuburnrate",
    user: "safuburnrateadmin",
    password: "safuburnrate!",
    ssl: true
  }
};

const knex = require("knex")(obj);

module.exports = knex;
